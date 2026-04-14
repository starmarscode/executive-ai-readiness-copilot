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
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">
            Executive AI Readiness Copilot
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Assess AI readiness. Identify high-value opportunities. Build a
            practical roadmap.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A focused executive-facing MVP that helps leaders evaluate
            organizational AI readiness, surface priority gaps, and generate a
            clear 30/60/90-day action plan.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
              Start assessment
            </button>

            <button className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Preview sample output
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {featureCards.map((card) => (
            <FeatureCard
              key={card.title}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
