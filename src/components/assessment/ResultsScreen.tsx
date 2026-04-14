import { AssessmentData } from "@/types/assessment";
import { scoreAssessment, CategoryScore } from "@/lib/scoring";

type Props = {
  data: AssessmentData;
  onReset: () => void;
};

function overallTier(score: number): { label: string; description: string } {
  if (score >= 80) return { label: "Strong", description: "Your organization has the foundations to pursue AI at scale." };
  if (score >= 60) return { label: "Moderate", description: "Good progress — targeted investments will unlock significant AI potential." };
  if (score >= 40) return { label: "Developing", description: "Key gaps exist across readiness dimensions that should be addressed before scaling." };
  if (score >= 20) return { label: "Early Stage", description: "Foundational work is needed in data, talent, and strategy before AI can deliver ROI." };
  return { label: "Critical Gaps", description: "Significant readiness deficits require executive attention before any AI investment." };
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100">
      <div
        className="h-1.5 rounded-full bg-slate-900 transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function CategoryCard({ category }: { category: CategoryScore }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-900">{category.label}</p>
        <span className="shrink-0 text-lg font-semibold tabular-nums text-slate-900">
          {category.score}
        </span>
      </div>
      <ScoreBar score={category.score} />
      <p className="mt-3 text-xs leading-5 text-slate-500">{category.description}</p>
    </div>
  );
}

export default function ResultsScreen({ data, onReset }: Props) {
  const scores = scoreAssessment(data);
  const tier = overallTier(scores.overall);

  const categories: CategoryScore[] = [
    scores.dataReadiness,
    scores.organizationalReadiness,
    scores.strategicClarity,
    scores.aiMaturity,
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">

        {/* Header */}
        <div className="mb-2 inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
          {data.companyName ? data.companyName : "AI Readiness Report"}
        </div>

        {/* Overall score */}
        <div className="mt-6 flex items-end gap-5">
          <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-2 border-slate-900">
            <span className="text-3xl font-bold tabular-nums leading-none text-slate-900">
              {scores.overall}
            </span>
            <span className="mt-0.5 text-xs text-slate-400">/ 100</span>
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-slate-900">
              {tier.label}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{tier.description}</p>
          </div>
        </div>

        {/* Overall bar */}
        <div className="mt-6 h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-slate-900 transition-all duration-700"
            style={{ width: `${scores.overall}%` }}
          />
        </div>

        <hr className="my-8 border-slate-100" />

        {/* Category breakdown */}
        <h2 className="mb-4 text-sm font-medium text-slate-700">
          Readiness breakdown
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((cat) => (
            <CategoryCard key={cat.label} category={cat} />
          ))}
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Start over
          </button>
        </div>
      </div>
    </main>
  );
}
