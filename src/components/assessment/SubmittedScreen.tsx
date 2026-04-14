type Props = {
  onReset: () => void;
};

export default function SubmittedScreen({ onReset }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <svg
            className="h-6 w-6 text-slate-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Analyzing your readiness...
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          Your responses have been captured. In the full product, this would trigger a structured AI analysis of your inputs and generate a personalized readiness report with a 30/60/90-day action plan.
        </p>

        <button
          type="button"
          onClick={onReset}
          className="mt-8 rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Start over
        </button>
      </div>
    </main>
  );
}
