import Link from "next/link";
import FeatureCard from "../components/FeatureCard";

const featureCards = [
  {
    title: "Deterministic scoring",
    description:
      "Structured readiness scoring across core business and operating dimensions.",
  },
  {
    title: "Executive synthesis",
    description:
      "Business-facing recommendations and summaries designed for leadership review.",
  },
  {
    title: "30/60/90-day roadmap",
    description:
      "A practical starting plan focused on credibility, clarity, and near-term action.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Radial glow behind headline */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-indigo-900/25 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-14 sm:px-10 sm:py-20 lg:px-12">
        <div className="max-w-3xl">
          {/* Pill badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-4 py-1.5 text-xs font-medium tracking-wide text-slate-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Executive AI Readiness Copilot
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[1.1]">
            Assess AI readiness.{" "}
            <span className="text-slate-300">
              Identify high-value opportunities.
            </span>{" "}
            Build a practical roadmap.
          </h1>

          {/* Subheading */}
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            A focused executive-facing tool that helps leaders evaluate
            organizational AI readiness, surface priority gaps, and generate a
            clear 30/60/90-day action plan.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 active:scale-[0.98]"
            >
              Start assessment
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <button className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-7 py-3.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white">
              Preview sample output
            </button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid gap-4 sm:mt-20 sm:grid-cols-3">
          {featureCards.map((card) => (
            <FeatureCard
              key={card.title}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        {/* Footer line */}
        <p className="mt-10 text-xs text-slate-600 sm:mt-16">
          No data stored. No account required. Results generated in seconds.
        </p>
      </section>
    </main>
  );
}
