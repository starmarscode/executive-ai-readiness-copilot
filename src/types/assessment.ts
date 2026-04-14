export type Industry =
  | "Technology"
  | "Healthcare"
  | "Finance"
  | "Retail"
  | "Manufacturing"
  | "Professional Services"
  | "Other";

export type CompanySize = "<50" | "50–500" | "500–5000" | "5000+";

export type BusinessModel = "B2B" | "B2C" | "B2B2C" | "Internal/Government";

export type AIUsage =
  | "None"
  | "Experimental"
  | "Pilot programs running"
  | "Production AI deployed";

export type DataMaturity =
  | "Minimal/spreadsheets"
  | "Structured databases"
  | "Data warehouse/lake"
  | "Real-time pipelines";

export type DataChallenge =
  | "Data quality"
  | "Data silos"
  | "Lack of labeled data"
  | "Privacy/compliance concerns"
  | "No clear data strategy";

export type AITalent =
  | "None"
  | "1–2 people"
  | "Small team 3–10"
  | "Mature team 10+";

export type AIMotivation =
  | "Cost reduction"
  | "Revenue growth"
  | "Competitive pressure"
  | "Operational efficiency"
  | "Customer experience"
  | "Risk management";

export type UseCase =
  | "Customer service automation"
  | "Predictive analytics"
  | "Document processing"
  | "Product recommendations"
  | "Fraud detection"
  | "Supply chain optimization"
  | "HR/talent"
  | "Other";

export type Timeline =
  | "0–3 months"
  | "3–6 months"
  | "6–12 months"
  | "12+ months";

export type BudgetRange =
  | "No budget"
  | "<$100K"
  | "$100K–$500K"
  | "$500K–$2M"
  | "$2M+";

export type PrimaryConcern =
  | "ROI uncertainty"
  | "Talent gaps"
  | "Data readiness"
  | "Change management"
  | "Vendor selection"
  | "Regulatory/compliance";

export interface AssessmentData {
  // Step 1 — Company Context
  companyName: string;
  industry: Industry | "";
  companySize: CompanySize | "";
  businessModel: BusinessModel | "";

  // Step 2 — AI & Data Readiness
  aiUsage: AIUsage | "";
  dataMaturity: DataMaturity | "";
  dataGovernance: boolean;
  dataChallenges: DataChallenge[];

  // Step 3 — Organizational Readiness
  hasAIChampion: boolean;
  aiTalent: AITalent | "";
  hasAITraining: boolean;
  aiMotivations: AIMotivation[];

  // Step 4 — Strategic Priorities
  useCases: UseCase[];
  timeline: Timeline | "";
  budget: BudgetRange | "";
  primaryConcern: PrimaryConcern | "";
}

export const initialAssessmentData: AssessmentData = {
  companyName: "",
  industry: "",
  companySize: "",
  businessModel: "",
  aiUsage: "",
  dataMaturity: "",
  dataGovernance: false,
  dataChallenges: [],
  hasAIChampion: false,
  aiTalent: "",
  hasAITraining: false,
  aiMotivations: [],
  useCases: [],
  timeline: "",
  budget: "",
  primaryConcern: "",
};
