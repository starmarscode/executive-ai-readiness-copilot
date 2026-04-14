# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured yet.

## Stack

- **Next.js 16** with the App Router (`src/app/`)
- **React 19**
- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css` and `postcss.config.mjs`. No `tailwind.config.*` file; v4 uses CSS-first config.
- **TypeScript**
- **Geist** font family (sans + mono) loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` / `--font-geist-mono`

## Architecture

This is an early-stage MVP. The entire app currently lives in two source files:

- [src/app/layout.tsx](src/app/layout.tsx) — root layout; sets up fonts and `<html>`/`<body>` wrappers
- [src/app/page.tsx](src/app/page.tsx) — landing page with hero, CTA buttons, and a 3-column feature card grid
- [src/components/FeatureCard.tsx](src/components/FeatureCard.tsx) — single reusable card component (title + description)

The CTA buttons ("Start assessment", "Preview sample output") are not yet wired up — no routing or handlers exist. The next phase of the product will involve building out the assessment flow.

## Style conventions

- Tailwind utility classes only — no CSS modules or styled-components
- Color palette: white/slate (`slate-50` through `slate-900`)
- Rounded corners: `rounded-xl` for buttons, `rounded-2xl` for cards
- Responsive via Tailwind breakpoints (`sm:`, `lg:`)
