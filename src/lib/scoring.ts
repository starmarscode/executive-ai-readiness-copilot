import {
  AssessmentData,
  AITalent,
  AIUsage,
  BudgetRange,
  DataMaturity,
  Timeline,
} from "@/types/assessment";

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export interface CategoryScore {
  label: string;
  score: number; // 0–100, integer
  description: string;
}

export interface AssessmentScores {
  dataReadiness: CategoryScore;
  organizationalReadiness: CategoryScore;
  strategicClarity: CategoryScore;
  aiMaturity: CategoryScore;
  overall: number; // 0–100, integer
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function round(n: number): number {
  return Math.round(Math.min(100, Math.max(0, n)));
}

function tierDescription(
  score: number,
  tiers: [number, string][] // [minScore, description], descending order
): string {
  for (const [min, label] of tiers) {
    if (score >= min) return label;
  }
  return tiers[tiers.length - 1][1];
}

// ---------------------------------------------------------------------------
// Sub-factor scores (each returns 0–100)
// ---------------------------------------------------------------------------

function scoreDataMaturity(v: DataMaturity | ""): number {
  const map: Record<DataMaturity, number> = {
    "Minimal/spreadsheets": 10,
    "Structured databases": 40,
    "Data warehouse/lake": 70,
    "Real-time pipelines": 100,
  };
  return v === "" ? 0 : map[v];
}

function scoreDataChallenges(count: number): number {
  // Inverse: more active blockers → lower score
  const maxChallenges = 5;
  return Math.max(0, 100 - count * (100 / maxChallenges));
}

function scoreAITalent(v: AITalent | ""): number {
  const map: Record<AITalent, number> = {
    None: 0,
    "1–2 people": 33,
    "Small team 3–10": 66,
    "Mature team 10+": 100,
  };
  return v === "" ? 0 : map[v];
}

function scoreAIUsage(v: AIUsage | ""): number {
  const map: Record<AIUsage, number> = {
    None: 0,
    Experimental: 33,
    "Pilot programs running": 66,
    "Production AI deployed": 100,
  };
  return v === "" ? 0 : map[v];
}

function scoreBudget(v: BudgetRange | ""): number {
  const map: Record<BudgetRange, number> = {
    "No budget": 0,
    "<$100K": 25,
    "$100K–$500K": 55,
    "$500K–$2M": 80,
    "$2M+": 100,
  };
  return v === "" ? 0 : map[v];
}

function scoreTimeline(v: Timeline | ""): number {
  // Any defined timeline scores higher than none; 3–6 months is the sweet spot
  const map: Record<Timeline, number> = {
    "0–3 months": 75,
    "3–6 months": 100,
    "6–12 months": 85,
    "12+ months": 60,
  };
  return v === "" ? 0 : map[v];
}

function scoreUseCases(count: number): number {
  // 2–4 use cases signals focused clarity; 0 or too many dilutes it
  if (count === 0) return 0;
  if (count === 1) return 55;
  if (count <= 4) return 100;
  if (count <= 6) return 75;
  return 55;
}

// ---------------------------------------------------------------------------
// Category scorers
// ---------------------------------------------------------------------------

function scoreDataReadiness(data: AssessmentData): CategoryScore {
  const maturity = scoreDataMaturity(data.dataMaturity);
  const governance = data.dataGovernance ? 100 : 0;
  const challenges = scoreDataChallenges(data.dataChallenges.length);

  const score = round(0.6 * maturity + 0.2 * governance + 0.2 * challenges);

  const description = tierDescription(score, [
    [80, "Your data infrastructure can support advanced AI workloads."],
    [60, "Solid foundation with some gaps to address before scaling AI."],
    [40, "Data infrastructure needs investment before AI can be effective."],
    [20, "Significant data gaps will limit AI ROI without remediation."],
    [0,  "Data readiness is a critical blocker — prioritize this first."],
  ]);

  return { label: "Data Readiness", score, description };
}

function scoreOrganizationalReadiness(data: AssessmentData): CategoryScore {
  const champion = data.hasAIChampion ? 100 : 0;
  const talent = scoreAITalent(data.aiTalent);
  const training = data.hasAITraining ? 100 : 0;
  // Breadth of stated motivations signals strategic alignment across the org
  const motivations = data.aiMotivations.length === 0 ? 0
    : data.aiMotivations.length === 1 ? 50
    : 100;

  const score = round(0.30 * champion + 0.40 * talent + 0.20 * training + 0.10 * motivations);

  const description = tierDescription(score, [
    [80, "Strong leadership alignment and talent to execute AI initiatives."],
    [60, "Good organizational foundation with some capability gaps."],
    [40, "Moderate readiness — talent and sponsorship gaps need attention."],
    [20, "Limited capacity — build the team and secure exec sponsorship."],
    [0,  "Organizational readiness is a critical risk — address talent and leadership first."],
  ]);

  return { label: "Organizational Readiness", score, description };
}

function scoreStrategicClarity(data: AssessmentData): CategoryScore {
  const budget = scoreBudget(data.budget);
  const useCases = scoreUseCases(data.useCases.length);
  const timeline = scoreTimeline(data.timeline);
  // Having identified a primary concern reflects strategic self-awareness
  const concern = data.primaryConcern === "" ? 0 : 100;

  const score = round(0.40 * budget + 0.25 * useCases + 0.25 * timeline + 0.10 * concern);

  const description = tierDescription(score, [
    [80, "Well-defined strategy with committed resources and clear use cases."],
    [60, "Good strategic direction with room to sharpen focus and commit budget."],
    [40, "Strategy is forming — prioritize use cases and secure funding."],
    [20, "Strategic clarity is low — define specific use cases and a timeline."],
    [0,  "No clear strategy or budget — executive alignment is needed now."],
  ]);

  return { label: "Strategic Clarity", score, description };
}

function scoreAIMaturity(data: AssessmentData): CategoryScore {
  const usage = scoreAIUsage(data.aiUsage);
  const talent = scoreAITalent(data.aiTalent);
  // Infrastructure maturity is a secondary signal of overall AI maturity
  const infra = scoreDataMaturity(data.dataMaturity);

  const score = round(0.60 * usage + 0.25 * talent + 0.15 * infra);

  const description = tierDescription(score, [
    [80, "AI is embedded in operations with strong supporting capabilities."],
    [60, "Active AI programs running — ready to scale with the right investment."],
    [40, "Early AI experiments underway — focus on piloting high-value use cases."],
    [20, "AI adoption is nascent — begin with a focused proof of concept."],
    [0,  "AI journey is just beginning — start with education and a pilot use case."],
  ]);

  return { label: "AI Maturity", score, description };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function scoreAssessment(data: AssessmentData): AssessmentScores {
  const dataReadiness = scoreDataReadiness(data);
  const organizationalReadiness = scoreOrganizationalReadiness(data);
  const strategicClarity = scoreStrategicClarity(data);
  const aiMaturity = scoreAIMaturity(data);

  const overall = round(
    (dataReadiness.score +
      organizationalReadiness.score +
      strategicClarity.score +
      aiMaturity.score) /
      4
  );

  return { dataReadiness, organizationalReadiness, strategicClarity, aiMaturity, overall };
}
