import FormField from "@/components/assessment/FormField";
import { AssessmentData, AIUsage, DataMaturity, DataChallenge } from "@/types/assessment";

type Props = {
  data: AssessmentData;
  onChange: <K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) => void;
};

const aiUsageOptions: AIUsage[] = [
  "None",
  "Experimental",
  "Pilot programs running",
  "Production AI deployed",
];

const dataMaturityOptions: DataMaturity[] = [
  "Minimal/spreadsheets",
  "Structured databases",
  "Data warehouse/lake",
  "Real-time pipelines",
];

const dataChallengeOptions: DataChallenge[] = [
  "Data quality",
  "Data silos",
  "Lack of labeled data",
  "Privacy/compliance concerns",
  "No clear data strategy",
];

function radioBlockClass(selected: boolean) {
  return `flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
    selected
      ? "border-slate-900 bg-slate-50 font-medium text-slate-900 ring-1 ring-inset ring-slate-900/10"
      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
  }`;
}

export default function Step2AIDataReadiness({ data, onChange }: Props) {
  function toggleChallenge(value: DataChallenge) {
    const next = data.dataChallenges.includes(value)
      ? data.dataChallenges.filter((v) => v !== value)
      : [...data.dataChallenges, value];
    onChange("dataChallenges", next);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">AI & data readiness</h2>
        <p className="mt-1 text-sm text-slate-500">
          Tell us about your current AI usage and data infrastructure.
        </p>
      </div>

      <FormField label="Current AI usage">
        <div className="flex flex-col gap-2">
          {aiUsageOptions.map((option) => (
            <label key={option} className={radioBlockClass(data.aiUsage === option)}>
              <input
                type="radio"
                className="sr-only"
                name="aiUsage"
                value={option}
                checked={data.aiUsage === option}
                onChange={() => onChange("aiUsage", option)}
              />
              {option}
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="Data infrastructure maturity">
        <div className="flex flex-col gap-2">
          {dataMaturityOptions.map((option) => (
            <label key={option} className={radioBlockClass(data.dataMaturity === option)}>
              <input
                type="radio"
                className="sr-only"
                name="dataMaturity"
                value={option}
                checked={data.dataMaturity === option}
                onChange={() => onChange("dataMaturity", option)}
              />
              {option}
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="Data governance policy in place?">
        <div className="flex gap-3">
          {([true, false] as const).map((val) => (
            <label
              key={String(val)}
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm transition ${
                data.dataGovernance === val
                  ? "border-slate-900 bg-slate-50 font-medium text-slate-900 ring-1 ring-inset ring-slate-900/10"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name="dataGovernance"
                checked={data.dataGovernance === val}
                onChange={() => onChange("dataGovernance", val)}
              />
              {val ? "Yes" : "No"}
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="Biggest data challenges" hint="Select all that apply">
        <div className="flex flex-col gap-2">
          {dataChallengeOptions.map((option) => {
            const checked = data.dataChallenges.includes(option);
            return (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                  checked
                    ? "border-slate-900 bg-slate-50 font-medium text-slate-900"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleChallenge(option)}
                />
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
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
    </div>
  );
}
