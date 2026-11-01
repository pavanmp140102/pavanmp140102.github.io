# Pavan Patil — Robotics Portfolio

Personal portfolio site for Pavan Patil, a robotics engineer specialising in autonomous systems and the automotive domain. Built with Astro and Tailwind CSS, deployed to GitHub Pages.

Inspired by [Brittany Chiang's portfolio](https://github.com/bchiang7/v4) — recreated from scratch using Astro.

**Live site:** https://pavanmp140102.github.io

---

## Tech stack

- [Astro](https://astro.build/) — static site generator
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) — blog post prose styling
- GitHub Actions — CI/CD to GitHub Pages

---

## Run locally

```bash
cd portfolio
npm install
npm run dev
```

Then open http://localhost:4321.

## Build

```bash
cd portfolio
npm run build
npm run preview   # preview the production build locally
```

---

## Project structure

```
portfolio/
├── public/
│   └── assets/           # static images (logo, profile photo, project images)
├── src/
│   ├── components/       # Navbar, Footer, sidebars, icons, SectionTitle
│   ├── content/
│   │   ├── blogs/        # Markdown blog posts
│   │   ├── experiences/  # Markdown experience entries
│   │   └── projects/     # Markdown project entries
│   ├── pages/
│   │   ├── index.astro   # main single-page portfolio
│   │   └── blog/         # blog archive + individual post pages
│   ├── sections/         # Hero, About, Experience, Work, Blog, Contact
│   └── styles/
│       └── global.css
├── astro.config.mjs
└── tailwind.config.mjs
```

---

## Adding content

### New experience
Create a file in `src/content/experiences/` with this frontmatter:

```yaml
---
role: "Your Role"
company: "Company Name"
duration: "Jan 2025 – Present"
startDate: "2025-01-01"
description: "What you did."
---
```

Experiences are sorted by `startDate` descending (most recent first).

### New project
Create a file in `src/content/projects/` with this frontmatter:

```yaml
---
title: "Project Name"
description: "What it does."
tech: "ROS 2 | C++ | Python"
github: "https://github.com/..."
image: "/assets/project-images/your-image.png"
featured: false        # set true to show in the alternating featured layout
order: 5               # lower numbers appear first
liveUrl: ""            # optional — link to a live demo
---
```

Projects are sorted by `order` ascending (then by title).

- `featured: false` → appears in the "Other Noteworthy Projects" card grid
- `featured: true` → appears in the full alternating image/text featured layout above the grid

### New blog post
Create a Markdown file in `src/content/blogs/` with this frontmatter:

```yaml
---
title: "Post Title"
date: 2025-06-01
description: "One-line summary shown in listings."
tags: ["ROS 2", "SLAM"]
---

Your post content in Markdown...
```

---

## Deploy

A GitHub Actions workflow at `.github/workflows/deploy-portfolio.yml` builds and deploys the site automatically on every push to `main`. No manual steps needed.
