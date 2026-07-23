"use client";

import React from "react";
import { CheckCircle2, XCircle, RotateCcw, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Lightweight practice quiz rendered at the end of each chapter.
 * Graded locally — instant feedback, retake any time.
 */
export default function ChapterQuiz({ quiz }) {
  const [answers, setAnswers] = React.useState({}); // index -> chosen option
  const [submitted, setSubmitted] = React.useState(false);

  if (!Array.isArray(quiz) || quiz.length === 0) return null;

  const score = quiz.reduce(
    (acc, q, i) =>
      acc +
      (String(answers[i]).trim().toLowerCase() ===
      String(q.correct_answer).trim().toLowerCase()
        ? 1
        : 0),
    0
  );

  const allAnswered = quiz.every((_, i) => answers[i] !== undefined);

  return (
    <div className="mt-8 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-500/30 dark:bg-indigo-500/5">
      <div className="flex items-center gap-2">
        <BrainCircuit className="text-indigo-500" size={22} />
        <h3 className="text-lg font-bold">Check your understanding</h3>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {quiz.length} quick questions on this chapter.
      </p>

      <div className="mt-5 space-y-6">
        {quiz.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <div key={qi}>
              <p className="font-medium">
                {qi + 1}. {q.question}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {q.options.map((option, oi) => {
                  const isChosen = chosen === option;
                  const isCorrect =
                    String(option).trim().toLowerCase() ===
                    String(q.correct_answer).trim().toLowerCase();
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, [qi]: option }))
                      }
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition",
                        !submitted &&
                          (isChosen
                            ? "border-indigo-500 bg-indigo-100 dark:bg-indigo-500/15"
                            : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-transparent dark:hover:border-gray-600"),
                        submitted &&
                          isCorrect &&
                          "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
                        submitted &&
                          isChosen &&
                          !isCorrect &&
                          "border-red-500 bg-red-50 dark:bg-red-500/10",
                        submitted &&
                          !isChosen &&
                          !isCorrect &&
                          "border-gray-200 opacity-60 dark:border-gray-700"
                      )}
                    >
                      <span className="flex-1">{option}</span>
                      {submitted && isCorrect && (
                        <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                      )}
                      {submitted && isChosen && !isCorrect && (
                        <XCircle size={16} className="shrink-0 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {submitted ? (
          <>
            <p className="font-semibold">
              Score:{" "}
              <span
                className={
                  score === quiz.length ? "text-emerald-500" : "text-indigo-500"
                }
              >
                {score}/{quiz.length}
              </span>{" "}
              {score === quiz.length && "🎉"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
            >
              <RotateCcw size={14} className="mr-2" />
              Retake
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}
          >
            Check answers
          </Button>
        )}
      </div>
    </div>
  );
}
