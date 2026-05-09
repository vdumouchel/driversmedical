"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useIntakeStore, type AnswerValue } from "@/stores/intake-store";
import { validateField } from "@/schemas/validation";
import { resolveLS } from "@/lib/i18n-utils";
import { useLang, useLocalePath } from "@/lib/i18n-hooks";
import { FieldRenderer } from "./field-renderer";
import { GroupStep } from "./group-step";
import { ProgressBar } from "./progress-bar";

interface QuestionFlowProps {
  provinceSlug: string;
}

export function QuestionFlow({ provinceSlug }: QuestionFlowProps) {
  const router = useRouter();
  const lang = useLang();
  const lp = useLocalePath();
  const {
    fields,
    answers,
    currentIndex,
    setAnswer,
    setAnswers,
    next,
    prev,
    getVisibleSteps,
    getVisibleStepIndex,
    getVisibleStepCount,
    getCurrentStep,
  } = useIntakeStore();

  const steps = useMemo(
    () => getVisibleSteps(),
    [getVisibleSteps, answers, fields]
  );
  const stepIndex = useMemo(
    () => getVisibleStepIndex(),
    [getVisibleStepIndex, currentIndex, answers, fields]
  );
  const stepCount = useMemo(
    () => getVisibleStepCount(),
    [getVisibleStepCount, answers, fields]
  );
  const currentStep = useMemo(
    () => getCurrentStep(),
    [getCurrentStep, currentIndex, answers, fields]
  );

  const isLastStep = stepIndex >= stepCount - 1;
  const isFinished = stepIndex >= stepCount;

  const advance = useCallback(() => {
    if (isLastStep) {
      router.push(lp(`/intake/${provinceSlug}/summary`));
    } else {
      next();
    }
  }, [isLastStep, next, provinceSlug, router, lp]);

  const handleFieldSubmit = useCallback(
    (value: string | number | boolean) => {
      if (!currentStep || currentStep.kind !== "field") return;
      const field = currentStep.field;

      const result = validateField(field, value, lang);
      if (!result.valid) return;

      setAnswer(field.id, value);

      const isAutoAdvance =
        field.type === "yes-no" || field.type === "option-select";

      if (isAutoAdvance) {
        setTimeout(advance, 250);
      } else {
        advance();
      }
    },
    [currentStep, setAnswer, advance]
  );

  const handleGroupSubmit = useCallback(
    (values: Record<string, AnswerValue>) => {
      setAnswers(values);
      advance();
    },
    [setAnswers, advance]
  );

  if (isFinished || !currentStep) {
    router.push(lp(`/intake/${provinceSlug}/summary`));
    return null;
  }

  const stepKey =
    currentStep.kind === "field" ? currentStep.field.id : `group:${currentStep.id}`;

  const showLabel =
    currentStep.kind === "field" && currentStep.field.type !== "checkbox";

  return (
    <div className="flex-1 flex flex-col">
      <ProgressBar current={stepIndex} total={stepCount} />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <button
            onClick={stepIndex > 0 ? prev : () => router.push(lp("/intake"))}
            className="mb-8 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {lang === "fr" ? "Retour" : "Back"}
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={stepKey}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center"
            >
              {currentStep.kind === "field" ? (
                <div className="w-full max-w-lg mx-auto">
                  {showLabel && (
                    <>
                      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 leading-snug">
                        {resolveLS(currentStep.field.label, lang)}
                      </h2>
                      {currentStep.field.description && (
                        <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
                          {resolveLS(currentStep.field.description, lang)}
                        </p>
                      )}
                      {!currentStep.field.description && <div className="mb-8" />}
                    </>
                  )}
                  {!showLabel && <div className="mb-4" />}
                  <div className="flex justify-center">
                    <FieldRenderer
                      field={currentStep.field}
                      value={answers[currentStep.field.id] as string | number | boolean | undefined}
                      onSubmit={handleFieldSubmit}
                    />
                  </div>
                </div>
              ) : (
                <GroupStep
                  step={currentStep}
                  answers={answers}
                  onSubmit={handleGroupSubmit}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
