"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useIntakeStore } from "@/stores/intake-store";
import { validateField } from "@/schemas/validation";
import { FieldRenderer } from "./field-renderer";
import { ProgressBar } from "./progress-bar";
import type { FormField } from "@/schemas/types";
import { useLocalePath } from "@/lib/i18n-utils";

interface QuestionFlowProps {
  provinceSlug: string;
}

export function QuestionFlow({ provinceSlug }: QuestionFlowProps) {
  const router = useRouter();
  const lp = useLocalePath();
  const {
    fields,
    answers,
    currentIndex,
    setAnswer,
    next,
    prev,
    getVisibleFields,
    getVisibleIndex,
    getVisibleCount,
  } = useIntakeStore();

  const visibleFields = useMemo(() => getVisibleFields(), [getVisibleFields, answers, fields]);
  const visibleIndex = useMemo(() => getVisibleIndex(), [getVisibleIndex, currentIndex, answers, fields]);
  const visibleCount = useMemo(() => getVisibleCount(), [getVisibleCount, answers, fields]);

  const currentField: FormField | undefined = visibleFields[visibleIndex];
  const isLastQuestion = visibleIndex >= visibleCount - 1;
  const isFinished = visibleIndex >= visibleCount;

  const handleSubmit = useCallback(
    (value: string | number | boolean) => {
      if (!currentField) return;

      // Validate
      const result = validateField(currentField, value);
      if (!result.valid) return; // field renderer shows inline error via its own state

      setAnswer(currentField.id, value);

      // Small delay for option-select / yes-no to show selection state
      const isAutoAdvance =
        currentField.type === "yes-no" || currentField.type === "option-select";

      const advance = () => {
        if (isLastQuestion) {
          router.push(lp(`/intake/${provinceSlug}/summary`));
        } else {
          next();
        }
      };

      if (isAutoAdvance) {
        setTimeout(advance, 250);
      } else {
        advance();
      }
    },
    [currentField, isLastQuestion, next, provinceSlug, router, setAnswer]
  );

  if (isFinished || !currentField) {
    router.push(lp(`/intake/${provinceSlug}/summary`));
    return null;
  }

  // For checkbox type, don't show the label above (it's in the checkbox itself)
  const showLabel = currentField.type !== "checkbox";

  return (
    <div className="flex-1 flex flex-col">
      <ProgressBar current={visibleIndex} total={visibleCount} />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Back button */}
          {visibleIndex > 0 && (
            <button
              onClick={prev}
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
              Back
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentField.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center"
            >
              {showLabel && (
                <>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 leading-snug">
                    {currentField.label}
                  </h2>
                  {currentField.description && (
                    <p className="text-muted-foreground text-sm mb-8 max-w-md">
                      {currentField.description}
                    </p>
                  )}
                  {!currentField.description && <div className="mb-8" />}
                </>
              )}
              {!showLabel && <div className="mb-4" />}

              <FieldRenderer
                field={currentField}
                value={answers[currentField.id]}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
