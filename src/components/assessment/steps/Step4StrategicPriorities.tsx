import FormField from "@/components/assessment/FormField";
import { AssessmentData, UseCase, Timeline, BudgetRange, PrimaryConcern } from "@/types/assessment";

type Props = {
  data: AssessmentData;
  onChange: <K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) => void;
};

const useCaseOptions: UseCase[] = [
  "Customer service automation",
  "Predictive analytics",
  "Document processing",
  "Product recommendations",
  "Fraud detection",
  "Supply chain optimization",
  "HR/talent",
  "Other",
];

const timelineOptions: Timeline[] = [
  "0–3 months",
  "3–6 months",
  "6–12 months",
  "12+ months",
];

const budgetOptions: BudgetRange[] = [
  "No budget",
  "<$100K",
  "$100K–$500K",
  "$500K–$2M",
  "$2M+",
];

const primaryConcernOptions: PrimaryConcern[] = [
  "ROI uncertainty",
  "Talent gaps",
  "Data readiness",
  "Change management",
  "Vendor selection",
  "Regulatory/compliance",
];

function radioBlockClass(selected: boolean) {
  return `flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
    selected
      ? "border-slate-900 bg-slate-50 font-medium text-slate-900 ring-1 ring-inset ring-slate-900/10"
      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
  }`;
}

export default function Step4StrategicPriorities({ data, onChange }: Props) {
  function toggleUseCase(value: UseCase) {
    const next = data.useCases.includes(value)
      ? data.useCases.filter((v) => v !== value)
      : [...data.useCases, value];
    onChange("useCases", next);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Strategic priorities</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tell us where you want AI to have the most impact and your constraints.
        </p>
      </div>

      <FormField label="Top priority AI use cases" hint="Select all that apply">
        <div className="grid grid-cols-2 gap-2">
          {useCaseOptions.map((option) => {
            const checked = data.useCases.includes(option);
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                  checked
                    ? "border-slate-900 bg-slate-50 font-medium text-slate-900"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleUseCase(option)}
                />
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    checked ? "border-slate-900 bg-slate-900" : "border-slate-300"
                  }`}
                >
                  {checked && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {option}
              </label>
            );
          })}
        </div>
      </FormField>

      <FormField label="Timeline to see AI results">
        <div className="flex flex-col gap-2">
          {timelineOptions.map((option) => (
            <label key={option} className={radioBlockClass(data.timeline === option)}>
              <input
                type="radio"
                className="sr-only"
                name="timeline"
                value={option}
                checked={data.timeline === option}
                onChange={() => onChange("timeline", option)}
              />
              {option}
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="Budget allocated for AI initiatives">
        <div className="flex flex-col gap-2">
          {budgetOptions.map((option) => (
            <label key={option} className={radioBlockClass(data.budget === option)}>
              <input
                type="radio"
                className="sr-only"
                name="budget"
                value={option}
                checked={data.budget === option}
                onChange={() => onChange("budget", option)}
              />
              {option}
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="Primary concern about AI adoption">
        <select
          value={data.primaryConcern}
          onChange={(e) => onChange("primaryConcern", e.target.value as PrimaryConcern | "")}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          <option value="" disabled>Select your top concern</option>
          {primaryConcernOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FormField>
    </div>
  );
}
