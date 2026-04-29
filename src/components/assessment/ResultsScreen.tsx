"use client";

import { useState, useEffect } from "react";
import { AssessmentData } from "@/types/assessment";
import { scoreAssessment, CategoryScore } from "@/lib/scoring";

type GeneratedReport = {
  executiveSummary: string;
  roadmap: {
    thirtyDays: string[];
    sixtyDays: string[];
    ninetyDays: string[];
  };
};

type FetchState =
  | { status: "loading" }
  | { status: "success"; report: GeneratedReport }
  | { status: "error" };

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

function CategoryCard({ category }: { category: CategoryScore }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-900">{category.label}</p>
        <span className="shrink-0 text-lg font-semibold tabular-nums text-slate-900">
          {category.score}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
        <div
          className="h-1.5 rounded-full bg-slate-800 transition-all duration-500"
          style={{ width: `${category.score}%` }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{category.description}</p>
    </div>
  );
}

function RoadmapPhase({
  phase,
  bullets,
}: {
  phase: string;
  bullets: string[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-900">
        {phase}
      </p>
      <ul className="flex flex-col gap-2">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white">
              {i + 1}
            </span>
            <span className="text-sm leading-6 text-slate-700">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-full rounded bg-slate-100" />
      <div className="h-4 w-5/6 rounded bg-slate-100" />
      <div className="h-4 w-4/6 rounded bg-slate-100" />
    </div>
  );
}

export default function ResultsScreen({ data, onReset }: Props) {
  const scores = scoreAssessment(data);
  const tier = overallTier(scores.overall);
  const [fetchState, setFetchState] = useState<FetchState>({ status: "loading" });
  const [copied, setCopied] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const categories: CategoryScore[] = [
    scores.dataReadiness,
    scores.organizationalReadiness,
    scores.strategicClarity,
    scores.aiMaturity,
  ];

  function buildPlainText(): string {
    const company = data.companyName || "AI Readiness Report";
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const lines: string[] = [
      "AI READINESS REPORT",
      company,
      date,
      "",
      `OVERALL SCORE: ${scores.overall}/100 — ${tier.label}`,
      tier.description,
      "",
      "READINESS BREAKDOWN",
      ...categories.flatMap((cat) => [
        `  ${cat.label}: ${cat.score}/100`,
        `  ${cat.description}`,
        "",
      ]),
    ];

    if (fetchState.status === "success") {
      lines.push(
        "EXECUTIVE SUMMARY",
        fetchState.report.executiveSummary,
        "",
        "30/60/90-DAY ROADMAP",
        "",
        "30 DAYS",
        ...fetchState.report.roadmap.thirtyDays.map((b, i) => `  ${i + 1}. ${b}`),
        "",
        "60 DAYS",
        ...fetchState.report.roadmap.sixtyDays.map((b, i) => `  ${i + 1}. ${b}`),
        "",
        "90 DAYS",
        ...fetchState.report.roadmap.ninetyDays.map((b, i) => `  ${i + 1}. ${b}`),
      );
    }

    return lines.join("\n");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRetry() {
    setRetryCount((c) => c + 1);
  }

  useEffect(() => {
    let cancelled = false;
    setFetchState({ status: "loading" });

    async function fetchReport() {
      try {
        const res = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data, scores }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const report: GeneratedReport = await res.json();
        if (!cancelled) setFetchState({ status: "success", report });
      } catch {
        if (!cancelled) setFetchState({ status: "error" });
      }
    }

    fetchReport();
    return () => { cancelled = true; };
  }, [retryCount]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Dark top banner */}
      <div className="border-b border-slate-100 bg-slate-950 text-white">
        <div className="mx-auto w-full max-w-2xl px-6 py-10 sm:px-10">
          <div className="mb-6 inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            {data.companyName ? data.companyName : "AI Readiness Report"}
          </div>

          <div className="flex items-end gap-5">
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-2 border-white/20 bg-white/5">
              <span className="text-3xl font-bold tabular-nums leading-none">
                {scores.overall}
              </span>
              <span className="mt-0.5 text-xs text-slate-400">/ 100</span>
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                {tier.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-400">{tier.description}</p>
            </div>
          </div>

          <div className="mt-6 h-1.5 w-full rounded-full bg-white/10">
            <div
              className="h-1.5 rounded-full bg-white transition-all duration-700"
              style={{ width: `${scores.overall}%` }}
            />
          </div>
        </div>
      </div>

      {/* White body */}
      <div className="bg-white">
        <div className="mx-auto w-full max-w-2xl px-6 py-10 sm:px-10">

          {/* Category breakdown */}
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Readiness breakdown
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {categories.map((cat) => (
              <CategoryCard key={cat.label} category={cat} />
            ))}
          </div>

          <hr className="my-8 border-slate-100" />

          {/* AI-generated executive summary */}
          <div className="mb-8">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Executive summary
            </h2>
            {fetchState.status === "loading" && <ReportSkeleton />}
            {fetchState.status === "error" && (
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-400">Unable to generate report.</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-sm font-medium text-slate-900 underline underline-offset-2 hover:text-slate-600"
                >
                  Retry
                </button>
              </div>
            )}
            {fetchState.status === "success" && (
              <p className="text-sm leading-7 text-slate-600">
                {fetchState.report.executiveSummary}
              </p>
            )}
          </div>

          {/* AI-generated roadmap */}
          <div>
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-400">
              30/60/90-day roadmap
            </h2>
            {fetchState.status === "loading" && (
              <div className="flex flex-col gap-8">
                {["30 days", "60 days", "90 days"].map((phase) => (
                  <div key={phase}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-900">
                      {phase}
                    </p>
                    <ReportSkeleton />
                  </div>
                ))}
              </div>
            )}
            {fetchState.status === "error" && (
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-400">Unable to generate report.</p>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-sm font-medium text-slate-900 underline underline-offset-2 hover:text-slate-600"
                >
                  Retry
                </button>
              </div>
            )}
            {fetchState.status === "success" && (
              <div className="flex flex-col gap-8">
                <RoadmapPhase
                  phase="30 days"
                  bullets={fetchState.report.roadmap.thirtyDays}
                />
                <RoadmapPhase
                  phase="60 days"
                  bullets={fetchState.report.roadmap.sixtyDays}
                />
                <RoadmapPhase
                  phase="90 days"
                  bullets={fetchState.report.roadmap.ninetyDays}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row">
            <button
              type="button"
              onClick={onReset}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Start over
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {copied ? "Copied!" : "Copy report"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
