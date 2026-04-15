type Props = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export default function FormField({ label, hint, children }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-800">{label}</label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {children}
    </div>
  );
}
