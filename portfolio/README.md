# Pavan Patil Robotics Portfolio (Astro + Tailwind)

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Reused the same icon style from the existing repository (logo + social icons) inside Astro components.
- The default resume button points to `https://drive.google.com` as a placeholder. Update `resumeUrl` in `src/components/Navbar.astro`.

## Deploy

A GitHub Actions workflow is included at `.github/workflows/deploy-portfolio.yml` to deploy the `portfolio/dist` output to GitHub Pages.
