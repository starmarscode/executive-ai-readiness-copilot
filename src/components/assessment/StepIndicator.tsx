type Props = {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
};

export default function StepIndicator({ currentStep, totalSteps, stepLabels }: Props) {
  const progressPct = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-10">
      {/* Numbered circles + connecting lines */}
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors
                  ${isCompleted || isActive
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-400"
                  }`}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {step < totalSteps && (
                <div className="mx-2 h-px flex-1 bg-slate-200" />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 w-full rounded-full bg-slate-100">
        <div
          className="h-1 rounded-full bg-slate-900 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step label */}
      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-xs text-slate-500">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-xs font-medium text-slate-700">
          {stepLabels[currentStep - 1]}
        </p>
      </div>
    </div>
  );
}
