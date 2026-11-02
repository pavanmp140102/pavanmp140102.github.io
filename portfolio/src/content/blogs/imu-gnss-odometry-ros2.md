---
title: "My Journey to Building Stable Global Odometry Using Only IMU and GNSS in ROS2"
date: 2026-05-25
description: "Can two sensors — an IMU and a GNSS receiver — produce usable global odometry? Here's my first attempt at sensor fusion using robot_localization in ROS2."
tags: ["ros2", "robotics", "sensor-fusion", "gnss", "imu", "localization"]
---

## 1. Motivation

Many outdoor robots start with only two sensors: a GNSS receiver and an IMU. Before adding wheel encoders, cameras, or LiDAR, I wanted to understand whether these two sensors alone could produce usable global odometry.

This is a common starting point in field robotics. You have a relatively cheap setup, and you want to know: how far can you get with just position from GNSS and motion from an IMU? The answer turns out to be more nuanced than I expected — and the journey taught me more about ROS2 localization than any tutorial I had read.

This post documents what I tried, what broke, and what I learned along the way. It is not a polished definitive guide. Some questions are still open.

---

## 2. The Question

The entire experiment revolves around one central question:

> **Can I obtain stable and meaningful odometry using only an IMU and GNSS?**

Everything else — the architecture choices, the debugging detours, the config tuning — is in service of answering this question honestly.

---

## 3. Understanding the Sensors

Before fusing anything, it helps to understand what each sensor actually gives you and where it falls short.

### GNSS

A GNSS receiver provides:

- **Latitude, Longitude, Altitude** — absolute position on Earth
- **Velocity** — some modules estimate velocity from Doppler shift

This sounds great on paper. In practice, raw GNSS has real problems:

- **Noise** — position jumps on the order of 1–5 meters are common with low-cost receivers
- **Multipath** — signals bouncing off buildings or terrain corrupt the measurement
- **Low update rate** — most modules output at 1–10 Hz, too slow for smooth motion estimation
- **No heading** — a single GNSS antenna cannot tell you which way the robot is pointing

If you plot raw GNSS position for a stationary robot, you will see it wander. That wandering is not the robot moving. It is measurement noise.

### IMU

An IMU provides:

- **Angular velocity** (gyroscope) — how fast the robot is rotating
- **Linear acceleration** (accelerometer) — the net acceleration including gravity

Limitations:

- **Bias** — the sensor reads a non-zero value even when stationary
- **Drift** — integrating angular velocity accumulates error over time
- **Gravity** — you must remove the gravitational component from acceleration before integrating

The most important thing to understand about IMUs for localization: **you cannot reliably integrate acceleration into position**. The bias causes the estimated velocity to grow over time, and integrated twice into position, the error becomes enormous within seconds.

Here is roughly what happens when you naively double-integrate raw accelerometer data for a robot that is completely stationary. The exact numbers are illustrative — they depend entirely on the IMU and its bias — but the shape of the curve is always the same, because error grows with the square of time:

```
t=0s    position error: ~0 m
t=5s    position error: ~0.5 m
t=30s   position error: several meters
t=60s   position error: tens of meters
```

The robot hasn't moved. The error is entirely due to bias drift. This is why IMU alone cannot give you position — it can only give you short-term motion changes.

---

## 4. Why Sensor Fusion Is Needed

Given the weaknesses of each sensor individually, the idea behind fusion is straightforward:

```
GNSS  →  absolute position (noisy, slow)
 +
IMU   →  relative motion (fast, drifts over time)
 =
EKF   →  better estimate than either alone
```

GNSS anchors the estimate to a real-world coordinate. It prevents the IMU drift from accumulating unboundedly. The IMU, in turn, fills in the gaps between GNSS updates and smooths out the noise in individual GNSS fixes.

The algorithm that does this combination is the **Extended Kalman Filter (EKF)**. The EKF maintains a state estimate (position, velocity, orientation) and a covariance matrix that represents how confident it is in each component. Every sensor measurement updates the state according to how trustworthy that measurement is relative to the current uncertainty.

The key intuition: when the GNSS noise is high, the EKF trusts the IMU more. When IMU drift is accumulating, the GNSS measurement pulls the estimate back toward ground truth. Neither sensor dominates; they are weighted by their respective uncertainties.

I won't go deep into the matrix math here — there are better resources for that. What matters practically is understanding that you control the filter's behavior through **covariance values**, which tell the filter how much to trust each input. Getting these wrong is the most common source of bad results, and I spent most of my debugging time on exactly this.

---

## 5. ROS2 Architecture

My first version used a single EKF that fused the IMU and GNSS and published `odom → base_link`. That is a common mistake, and the `robot_localization` documentation explains why: the `odom` frame is supposed to be **continuous** — it can drift, but it must never jump — while GNSS corrections arrive as discrete jumps. Fusing GNSS into the `odom` filter makes the robot's local pose teleport every time a fix lands.

The recommended layout uses **two EKF instances** plus `navsat_transform_node`:

```
[IMU] ── /imu/data ──┬─────────────► [ekf_local]  ──► TF odom → base_link
                     │                (world_frame: odom)
                     │
                     ├─────────────► [ekf_global] ──► TF map → odom
                     │                (world_frame: map)
                     │                   ▲        │
                     │   /odometry/gps   │        │ /odometry/filtered/global
                     │                   │        ▼
                     └─────────────► [navsat_transform_node] ◄── /fix ── [GNSS]
```

**`ekf_local`** (world frame `odom`)
Fuses only continuous sources and publishes `odom → base_link`. It gives a smooth local estimate that drifts over time.

**`ekf_global`** (world frame `map`)
Fuses the same continuous sources *plus* the GNSS-derived odometry, and publishes `map → odom`. When a GNSS correction arrives, it is this transform that absorbs the jump, so `odom → base_link` stays smooth.

**`navsat_transform_node`**
Converts raw GNSS fixes (latitude/longitude/altitude from `/fix`) into odometry in the robot's world frame. It handles the datum (the reference origin), the projection from spherical to Cartesian coordinates, and the heading offset between the IMU's idea of north and the robot's frame. Note the loop: it needs the IMU for heading *and* `ekf_global`'s output to know where the robot is, and its output feeds back into `ekf_global`.

The reason this split exists: the EKF works in a local Cartesian frame (meters), not in GPS coordinates (degrees). `navsat_transform_node` does that conversion so the filter doesn't have to care about geodesy.

There is an uncomfortable consequence hiding in this diagram. With only an IMU and GNSS, **`ekf_local` has no source of velocity or position at all** — just orientation and acceleration. Keep that in mind; it turns out to be the answer to the question this post started with.

---

## 6. Hardware Setup

<!-- TODO: receiver and IMU models, platform, and whether RTK was available -->

The setup was deliberately minimal: a low-cost GNSS receiver and a 9-axis IMU, both publishing straight into ROS 2.

Two details mattered more than the hardware itself:

- **The IMU's frame.** `robot_localization` expects data that follows REP-103 (x forward, y left, z up) with yaw measured counter-clockwise from east (ENU). Many IMU drivers publish in NED or with yaw from north, and the filter will happily fuse a heading that is off by 90° or mirrored.
- **The antenna position.** The GNSS antenna is not at the robot's center. A static transform from `base_link` to the antenna's frame lets `navsat_transform_node` correct for the offset; without it, the position estimate swings whenever the robot turns.

---

## 7. Configuration

These are the parameters that made the biggest difference. Everything else stayed close to the package defaults.

```yaml
ekf_global:
  ros__parameters:
    two_d_mode: true           # ground robot: ignore z, roll, pitch
    world_frame: map
    imu0: /imu/data
    #            x     y     z     roll  pitch yaw
    #            vx    vy    vz    vroll vpitch vyaw
    #            ax    ay    az
    imu0_config: [false, false, false, false, false, true,
                  false, false, false, false, false, true,
                  true,  false, false]
    imu0_remove_gravitational_acceleration: true
    odom0: /odometry/gps
    odom0_config: [true,  true,  false, false, false, false,
                   false, false, false, false, false, false,
                   false, false, false]

navsat_transform:
  ros__parameters:
    magnetic_declination_radians: 0.0   # set for your location
    yaw_offset: 0.0                     # if the IMU reads 0 at magnetic north, use pi/2
    zero_altitude: true
    publish_filtered_gps: true
```

The rule of thumb that saved me the most time: **fuse each quantity from exactly one source**. From the GNSS, fuse only `x` and `y`. From the IMU, fuse yaw, yaw rate, and forward acceleration — never position.

<!-- TODO: paste the actual config used, if it differs -->

---

## 8. First Results

Standing still, raw GNSS wandered by up to about **0.45 m** — consistent with what you would expect from a non-RTK receiver in open sky.

After fusion, the global estimate was noticeably smoother: the filter averaged out much of the fix-to-fix jitter instead of chasing every update.

<!-- TODO: filtered position spread when stationary, and a plot of raw GNSS vs filtered trajectory while driving -->

Driving was a different story. The global position stayed anchored, but the local estimate (`odom → base_link`) was not useful on its own, and the heading needed work before the global track lined up with reality.

---

## 9. What Went Wrong

<!-- TODO: confirm which of these actually happened and in what order; add anything missing -->

**The trajectory was rotated.** The fused path had the right shape but was turned relative to the real one. The cause was heading: magnetic declination and `yaw_offset` in `navsat_transform_node`. If the IMU reports 0 at magnetic north, ENU expects 0 at east, so the offset is π/2 — plus the declination for your location.

**The filter trusted GNSS too much.** If the receiver driver reports unrealistically small covariances in `NavSatFix`, the EKF treats every noisy fix as truth and the estimate jumps with it. Checking the published covariance — and inflating it when needed — fixed most of the jitter.

**The local frame drifted away.** This is the consequence from section 5. With nothing measuring velocity, `ekf_local` can only integrate acceleration, which is exactly what section 3 showed you must not do.

---

## 10. So, Can IMU + GNSS Give Stable Odometry?

The honest answer is **half yes**.

- **Global position: yes.** Fused with an IMU, GNSS gives a bounded global position. Its error stays near the receiver's noise level — sub-meter here — and never drifts away.
- **Smooth local odometry: no.** Neither sensor measures how far the robot actually moved between updates. The IMU's accelerometer is too biased to integrate, and GNSS is too noisy and slow to differentiate. Without a velocity source, there is nothing for the `odom` frame to stand on.

That missing piece is what wheel encoders (or visual or LiDAR odometry) provide. With a velocity source in `ekf_local`, the two-filter design finally works as intended: smooth locally, anchored globally.

---

## 11. Takeaways

- Use two EKFs: continuous sources in `odom`, GNSS in `map`. Never fuse GNSS into the frame that publishes `odom → base_link`.
- Fix the IMU's frame convention before touching anything else. A wrong yaw convention looks like every other bug.
- Fuse each quantity from one source, and check the covariances your drivers actually publish.
- IMU + GNSS gives you a good global position, not good odometry. Add a velocity source for that.

The next step is adding wheel odometry and seeing how much the local estimate improves.
