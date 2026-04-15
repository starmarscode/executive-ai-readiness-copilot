import FormField from "@/components/assessment/FormField";
import { AssessmentData, AITalent, AIMotivation } from "@/types/assessment";

type Props = {
  data: AssessmentData;
  onChange: <K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) => void;
};

const aiTalentOptions: AITalent[] = [
  "None",
  "1–2 people",
  "Small team 3–10",
  "Mature team 10+",
];

const aiMotivationOptions: AIMotivation[] = [
  "Cost reduction",
  "Revenue growth",
  "Competitive pressure",
  "Operational efficiency",
  "Customer experience",
  "Risk management",
];

function radioBlockClass(selected: boolean) {
  return `flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
    selected
      ? "border-slate-900 bg-slate-50 font-medium text-slate-900 ring-1 ring-inset ring-slate-900/10"
      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
  }`;
}

export default function Step3OrganizationalReadiness({ data, onChange }: Props) {
  function toggleMotivation(value: AIMotivation) {
    const next = data.aiMotivations.includes(value)
      ? data.aiMotivations.filter((v) => v !== value)
      : [...data.aiMotivations, value];
    onChange("aiMotivations", next);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Organizational readiness</h2>
        <p className="mt-1 text-sm text-slate-500">
          Help us understand your team's capacity and leadership alignment for AI adoption.
        </p>
      </div>

      <FormField label="Executive-level AI champion or sponsor in place?">
        <div className="flex gap-3">
          {([true, false] as const).map((val) => (
            <label
              key={String(val)}
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm transition ${
                data.hasAIChampion === val
                  ? "border-slate-900 bg-slate-50 font-medium text-slate-900 ring-1 ring-inset ring-slate-900/10"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name="hasAIChampion"
                checked={data.hasAIChampion === val}
                onChange={() => onChange("hasAIChampion", val)}
              />
              {val ? "Yes" : "No"}
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="Dedicated AI/ML talent">
        <div className="flex flex-col gap-2">
          {aiTalentOptions.map((option) => (
            <label key={option} className={radioBlockClass(data.aiTalent === option)}>
              <input
                type="radio"
                className="sr-only"
                name="aiTalent"
                value={option}
                checked={data.aiTalent === option}
                onChange={() => onChange("aiTalent", option)}
              />
              {option}
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="AI training or upskilling programs in place?">
        <div className="flex gap-3">
          {([true, false] as const).map((val) => (
            <label
              key={String(val)}
              className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm transition ${
                data.hasAITraining === val
                  ? "border-slate-900 bg-slate-50 font-medium text-slate-900 ring-1 ring-inset ring-slate-900/10"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name="hasAITraining"
                checked={data.hasAITraining === val}
                onChange={() => onChange("hasAITraining", val)}
              />
              {val ? "Yes" : "No"}
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="Primary motivation for AI adoption" hint="Select all that apply">
        <div className="flex flex-col gap-2">
          {aiMotivationOptions.map((option) => {
            const checked = data.aiMotivations.includes(option);
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
                  onChange={() => toggleMotivation(option)}
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
