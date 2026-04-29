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
- **TypeScript** (strict mode, path alias `@/*` → `./src/*`)
- **Geist** font family (sans + mono) loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` / `--font-geist-mono`
- **groq-sdk** — LLM calls use Groq (`llama-3.3-70b-versatile`), not the Anthropic API. `@anthropic-ai/sdk` is installed in `package.json` but currently unused.

## Deployment

Deployed to Vercel on the `main` branch. Production URL: `executive-ai-readiness-copilot.vercel.app`

Pushes to `main` trigger automatic redeploys. `GROQ_API_KEY` must be set as a Vercel environment variable for report generation to work in production.

## Environment

`.env.local` must contain:
```
GROQ_API_KEY=<your key>
```
The app will start without it but report generation will fail at runtime.

## Architecture

A fully functional AI readiness assessment with four layers:

**Types & data model** — `src/types/assessment.ts`
All shared types (`AssessmentData`, `AssessmentScores`, enum literals). `initialAssessmentData` is the canonical empty-form state used for resets.

**Scoring engine** — `src/lib/scoring.ts`
`scoreAssessment(data: AssessmentData): AssessmentScores` — pure, deterministic. Computes four weighted category scores (Data Readiness, Organizational Readiness, Strategic Clarity, AI Maturity) and an overall average, all 0–100 integers. No I/O. Call this before the AI report step.

**API route** — `src/app/api/generate-report/route.ts`
`POST /api/generate-report` — accepts `{ data: AssessmentData, scores: AssessmentScores }`, calls Groq, returns `{ executiveSummary: string, roadmap: { thirtyDays, sixtyDays, ninetyDays } }`. Strips markdown code fences from the raw LLM response before parsing JSON.

**UI — assessment flow** — `src/app/assessment/page.tsx` (client component)
Manages step state (1–4), form data, and `submitted` flag. On submit it renders `<ResultsScreen data={data} onReset={handleReset} />`. Step components receive `{ data, onChange }` props.

- `src/components/assessment/steps/Step1CompanyContext.tsx` — company name, industry, size, business model
- `src/components/assessment/steps/Step2AIDataReadiness.tsx` — AI usage, data maturity, governance, data challenges
- `src/components/assessment/steps/Step3OrganizationalReadiness.tsx` — AI champion, talent, training, motivations
- `src/components/assessment/steps/Step4StrategicPriorities.tsx` — use cases, timeline, budget, primary concern

**UI — results** — `src/components/assessment/ResultsScreen.tsx`
Calls `scoreAssessment(data)` client-side, then POSTs to `/api/generate-report`. Renders scores with progress bars and the AI-generated executive summary + 30/60/90-day roadmap. Includes a "Copy report" button that formats output as plain text.

**UI — shared primitives**
- `src/components/assessment/StepIndicator.tsx` — numbered step progress bar
- `src/components/assessment/FormField.tsx` — label + optional hint wrapper
- `src/components/FeatureCard.tsx` — used only on the landing page

**Landing page** — `src/app/page.tsx`
Marketing page. "Start assessment" links to `/assessment`. "Preview sample output" is not yet wired up.

## Data flow

```
User completes 4-step form
  → AssessmentData (client state)
  → scoreAssessment(data)          // pure, in ResultsScreen on mount
  → POST /api/generate-report      // { data, scores } → Groq → JSON
  → Render scores + AI report
```

## Style conventions

- Tailwind utility classes only — no CSS modules or styled-components
- Color palette: white/slate (`slate-50` through `slate-900`) with `emerald-500` as the single accent (nav dot, active step indicator)
- Rounded corners: `rounded-xl` for buttons, `rounded-2xl` for cards
- Responsive via Tailwind breakpoints (`sm:`, `lg:`)
- Max content width: `max-w-2xl` for assessment flow, `max-w-5xl` for landing page
