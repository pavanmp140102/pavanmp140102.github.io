# Pavan Patil Robotics Portfolio

A modern, maintainable portfolio built with **Astro** and **Tailwind CSS**, featuring a content-first approach using markdown files for easy data management.

## 🚀 Quick Start

### Prerequisites
- Node.js 22.23.4+ and npm (CI builds with Node 24, see `.nvmrc`)

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:4321)
npm run dev
```

### Build for Production

```bash
# Build the static site
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.astro
│   ├── Footer.astro
│   └── ...
├── pages/              # Routes & pages
│   ├── index.astro     # Homepage
│   └── blog/
│       ├── index.astro       # Blog archive
│       └── [slug].astro      # Individual blog posts
├── sections/           # Homepage sections
│   ├── Hero.astro
│   ├── About.astro
│   ├── Experience.astro
│   ├── Work.astro
│   ├── Blog.astro
│   └── Contact.astro
├── content/            # Data collections (markdown files)
│   ├── config.ts              # Collection schemas
│   ├── experiences/           # Your work experience
│   ├── projects/              # Your projects
│   └── blogs/                 # Blog posts
└── styles/
    └── global.css      # Global styles & theme
```

## 📝 Content Management

All content is stored as markdown files in `src/content/`. This makes the portfolio **easy to maintain and update without touching component code**.

### Adding an Experience

Create a new file in `src/content/experiences/` (e.g., `my-internship.md`):

```yaml
---
role: "Software Engineer Intern"
company: "Tech Company"
duration: "Jan 2024 – Jun 2024"
startDate: "2024-01-01"                            # used for sorting, newest first
description: "Brief description of your role and accomplishments."
---
```

**File naming:** Use kebab-case (`my-internship.md`, `summer-2024.md`)

### Adding a Project

Projects are displayed in two formats depending on the `featured` flag:

**Featured projects** (`featured: true`) — rendered as large showcase cards with a hero image, alternating left/right layout, and an overlay effect. Require an `image` field pointing to a file in `public/assets/project-images/`.

**Other/Noteworthy projects** (`featured: false`) — rendered as small cards in a 3-column grid with a folder icon. No image is shown; the `image` field is ignored and can be omitted.

Create a new file in `src/content/projects/` (e.g., `robot-navigation.md`):

```yaml
---
title: "Autonomous Navigation Robot"
description: "Detailed description of the project and its impact."
tech: "ROS2 | Python | LiDAR"
github: "https://github.com/yourusername/repo-name"
featured: true                                      # false = card grid, no image needed
order: 1                                            # lower numbers appear first
image: "/assets/project-images/robot.png"           # only required when featured: true
# liveUrl: "https://example.com"                    # optional for both types
---
```

**Image path:** Store PNG/SVG files in `public/assets/project-images/` and reference them in the `image` field. Only needed for featured projects.

### Adding a Blog Post

Create a new file in `src/content/blogs/` (e.g., `ros2-guide.md`):

```yaml
---
title: "Getting Started with ROS2"
date: 2026-05-25
description: "A beginner's guide to ROS2 and autonomous systems."
tags: ["ros2", "robotics", "tutorial"]
---

## Introduction

Your markdown content goes here. This supports:
- **Bold** and *italic* text
- Lists and code blocks
- Headings and sections
- Links and images

## Section 2

More content...
```

**Important:** The `date` field must be in `YYYY-MM-DD` format. Blog posts are automatically sorted by date (newest first).

**Optional:** The `tags` field is optional but recommended for categorization.

## 🛠️ Maintenance

### Updating Homepage Content

- **About section & skills:** Edit `src/sections/About.astro`
- **Hero headline/CTA:** Edit `src/sections/Hero.astro`
- **Contact email:** Edit `src/lib/site.ts`

### Updating Resume Link

In `src/components/Navbar.astro`, find the resume button and update:
```astro
<a href="https://your-resume-url.pdf" target="_blank">
```

### Updating Personal Info

Check `src/lib/site.ts`, `src/components/Navbar.astro`, `src/components/SocialSidebar.astro` and `src/sections/Hero.astro` for personal details to update.

### Theme & Styling

- **Colors & fonts:** Edit the theme in `tailwind.config.mjs`
- **Global styles:** `src/styles/global.css`
- **Page `<head>` (title, meta, analytics):** `src/layouts/Layout.astro`
- **All sections:** Use Tailwind classes in `.astro` files

## 🚀 Deployment

### GitHub Pages

A GitHub Actions workflow is included (`.github/workflows/deploy-portfolio.yml`) to automatically deploy to GitHub Pages on every push to `main`.

**Setup:**
1. Push code to GitHub
2. The workflow builds `portfolio/` and deploys it with GitHub Pages Actions (no `gh-pages` branch)
3. Portfolio appears at `https://pavanmp140102.github.io`

**Manual deployment:**
```bash
npm run build
# Deploy dist/ folder to your hosting platform
```

## 📋 Common Tasks Checklist

- [ ] Update resume link in Navbar
- [ ] Add profile picture/image
- [ ] Update About section with your bio
- [ ] Add 2-3 featured projects
- [ ] Add your work experience
- [ ] Update Contact section with email/links
- [ ] Write first blog post
- [ ] Deploy to GitHub Pages

## 💡 Tips

- **Keep content fresh:** Post a blog every 2-3 weeks to show activity
- **Showcase skills:** Highlight relevant tech in projects and experiences
- **External links:** All GitHub, LinkedIn, and portfolio links should open in new tabs (already configured)
- **Images:** Use SVG for icons/illustrations (text-based, scalable, lightweight)
- **Mobile first:** Portfolio is fully responsive; test on mobile before deploying

## 📚 Tech Stack

- **Astro** - Static site generation with minimal JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Markdown** - Content format (via Astro Content Collections)
- **GitHub Pages** - Hosting & deployment

## 📄 License

This portfolio template is open source and available under the MIT License.
