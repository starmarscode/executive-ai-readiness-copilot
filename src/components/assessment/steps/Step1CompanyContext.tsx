import FormField from "@/components/assessment/FormField";
import { AssessmentData, CompanySize, Industry, BusinessModel } from "@/types/assessment";

type Props = {
  data: AssessmentData;
  onChange: <K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) => void;
};

const industries: Industry[] = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Professional Services",
  "Other",
];

const companySizes: CompanySize[] = ["<50", "50–500", "500–5000", "5000+"];

const businessModels: BusinessModel[] = ["B2B", "B2C", "B2B2C", "Internal/Government"];

const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none";

export default function Step1CompanyContext({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Company context</h2>
        <p className="mt-1 text-sm text-slate-500">
          Help us understand your organization before we assess AI readiness.
        </p>
      </div>

      <FormField label="Company name">
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          placeholder="Acme Corp"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
        />
      </FormField>

      <FormField label="Industry">
        <select
          value={data.industry}
          onChange={(e) => onChange("industry", e.target.value as Industry | "")}
          className={selectClass}
        >
          <option value="" disabled>Select an industry</option>
          {industries.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Company size">
        <div className="flex flex-col gap-2">
          {companySizes.map((size) => (
            <label
              key={size}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition
                ${data.companySize === size
                  ? "border-slate-900 bg-slate-50 font-medium text-slate-900"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              <input
                type="radio"
                className="sr-only"
                name="companySize"
                value={size}
                checked={data.companySize === size}
                onChange={() => onChange("companySize", size)}
              />
              {size} employees
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="Primary business model">
        <select
          value={data.businessModel}
          onChange={(e) => onChange("businessModel", e.target.value as BusinessModel | "")}
          className={selectClass}
        >
          <option value="" disabled>Select a model</option>
          {businessModels.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </FormField>
    </div>
  );
}
