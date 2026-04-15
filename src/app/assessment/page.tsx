"use client";

import { useState } from "react";
import Link from "next/link";
import { AssessmentData, initialAssessmentData } from "@/types/assessment";
import StepIndicator from "@/components/assessment/StepIndicator";
import ResultsScreen from "@/components/assessment/ResultsScreen";
import Step1CompanyContext from "@/components/assessment/steps/Step1CompanyContext";
import Step2AIDataReadiness from "@/components/assessment/steps/Step2AIDataReadiness";
import Step3OrganizationalReadiness from "@/components/assessment/steps/Step3OrganizationalReadiness";
import Step4StrategicPriorities from "@/components/assessment/steps/Step4StrategicPriorities";

const STEP_LABELS = [
  "Company context",
  "AI & data readiness",
  "Organizational readiness",
  "Strategic priorities",
];

const TOTAL_STEPS = 4;

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AssessmentData>(initialAssessmentData);
  const [submitted, setSubmitted] = useState(false);

  function handleChange<K extends keyof AssessmentData>(field: K, value: AssessmentData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit() {
    setSubmitted(true);
    // Future: send `data` to API here
  }

  function handleReset() {
    setData(initialAssessmentData);
    setCurrentStep(1);
    setSubmitted(false);
  }

  if (submitted) {
    return <ResultsScreen data={data} onReset={handleReset} />;
  }

  const stepProps = { data, onChange: handleChange };

  function renderStep() {
    switch (currentStep) {
      case 1: return <Step1CompanyContext {...stepProps} />;
      case 2: return <Step2AIDataReadiness {...stepProps} />;
      case 3: return <Step3OrganizationalReadiness {...stepProps} />;
      case 4: return <Step4StrategicPriorities {...stepProps} />;
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 px-6 py-4 sm:px-10">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <Link href="/" className="text-sm font-semibold tracking-tight text-slate-900">
            AI Readiness Copilot
          </Link>
        </div>
      </header>

      <main>
      <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepLabels={STEP_LABELS}
        />

        <div className="pb-10">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Generate my readiness report
            </button>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
