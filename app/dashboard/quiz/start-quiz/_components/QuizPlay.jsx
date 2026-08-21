"use client";

import React from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { differenceInSeconds } from "date-fns";
import {
  BarChart,
  CheckCircle2,
  ChevronRight,
  Flag,
  Loader2,
  Timer,
  XCircle,
} from "lucide-react";
import { cn, formatTimeDelta } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import BlankAnswerInput from "./BlankAnswerInput";

/**
 * Unified quiz player for mcq / open_ended / mixed games.
 * Flow per question: answer → Submit (graded, feedback shown) → Next.
 * The final question is graded BEFORE the game ends.
 */
export default function QuizPlay({ game }) {
  const router = useRouter();
  const questions = game.questions || [];

  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState(null);
  const [blankAnswer, setBlankAnswer] = React.useState("");
  const [feedback, setFeedback] = React.useState(null); // {isCorrect?, percentageCorrect?, correctAnswer}
  const [isChecking, setIsChecking] = React.useState(false);
  const [hasEnded, setHasEnded] = React.useState(false);
  const [stats, setStats] = React.useState({ correct: 0, wrong: 0, pctSum: 0, pctCount: 0 });
  const [now, setNow] = React.useState(new Date());

  const currentQuestion = questions[questionIndex];
  const isMcq = currentQuestion?.questionType
    ? currentQuestion.questionType === "mcq"
    : game.gameType === "mcq";

  const options = React.useMemo(() => {
    if (!currentQuestion?.options) return [];
    try {
      return typeof currentQuestion.options === "string"
        ? JSON.parse(currentQuestion.options)
        : currentQuestion.options;
    } catch {
      return [];
    }
  }, [currentQuestion]);

  React.useEffect(() => {
    if (hasEnded) return;
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const collectOpenEndedAnswer = () => {
    let filled = blankAnswer;
    document.querySelectorAll("#user-blank-input").forEach((input) => {
      filled = filled.replace("_____", input.value);
      input.value = "";
    });
    return filled;
  };

  const handleSubmit = async () => {
    if (feedback || isChecking || !currentQuestion) return;
    const userInput = isMcq
      ? options[selectedChoice]
      : collectOpenEndedAnswer();
    if (userInput === undefined || userInput === null) return;

    setIsChecking(true);
    try {
      const { data } = await axios.post("/api/checkAnswer", {
        questionId: currentQuestion.id,
        userInput: String(userInput),
      });
      setFeedback(data);
      setStats((s) =>
        isMcq
          ? {
              ...s,
              correct: s.correct + (data.isCorrect ? 1 : 0),
              wrong: s.wrong + (data.isCorrect ? 0 : 1),
            }
          : {
              ...s,
              pctSum: s.pctSum + (data.percentageCorrect ?? 0),
              pctCount: s.pctCount + 1,
            }
      );
    } catch (error) {
      console.error("Check answer failed:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNext = async () => {
    if (!feedback) return;
    if (questionIndex >= questions.length - 1) {
      // Finish: stamp timeEnded, then go to statistics.
      setHasEnded(true);
      try {
        await axios.post("/api/endGame", { gameId: game.id });
      } catch (e) {
        console.error("endGame failed:", e);
      }
      return;
    }
    setQuestionIndex((i) => i + 1);
    setSelectedChoice(null);
    setBlankAnswer("");
    setFeedback(null);
  };

  const avgPct =
    stats.pctCount > 0 ? Math.round(stats.pctSum / stats.pctCount) : null;
  const progress = questions.length
    ? Math.round(((questionIndex + (feedback ? 1 : 0)) / questions.length) * 100)
    : 0;

  if (hasEnded) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <Flag size={30} />
        </div>
        <h2 className="mt-4 text-2xl font-bold">Quiz complete!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Finished in{" "}
          {formatTimeDelta(
            differenceInSeconds(new Date(), new Date(game.timeStarted))
          )}
          {stats.correct + stats.wrong > 0 &&
            ` · ${stats.correct}/${stats.correct + stats.wrong} correct`}
          {avgPct !== null && ` · avg similarity ${avgPct}%`}
        </p>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-6")}
        >
          View Statistics
          <BarChart className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-muted-foreground">
        This quiz has no questions.
      </div>
    );
  }

  return (
    <div className="mx-auto w-[92vw] max-w-3xl py-10">
      {/* Top bar: topic, timer, score */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-medium text-green-500 dark:text-green-300">
          {game.topic}
        </span>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Timer size={16} />
            {formatTimeDelta(
              differenceInSeconds(now, new Date(game.timeStarted))
            )}
          </span>
          {(stats.correct > 0 || stats.wrong > 0) && (
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-500">
                <CheckCircle2 size={15} /> {stats.correct}
              </span>
              <span className="flex items-center gap-1 text-red-500">
                <XCircle size={15} /> {stats.wrong}
              </span>
            </span>
          )}
          {avgPct !== null && (
            <span className="text-green-500 dark:text-green-300">
              avg {avgPct}%
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#11151D]">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Question {questionIndex + 1} of {questions.length}
          {currentQuestion.questionType && (
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 normal-case text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {currentQuestion.questionType === "mcq"
                ? "Multiple choice"
                : "Fill the blanks"}
            </span>
          )}
        </p>
        <h2 className="mt-2 text-lg font-semibold leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Answer area */}
        {isMcq ? (
          <div className="mt-5 grid gap-3">
            {options.map((option, index) => {
              const chosen = selectedChoice === index;
              const graded = !!feedback;
              // Only the CHOSEN option gets feedback styling — the correct
              // answer is never revealed during play (see it in statistics).
              const chosenCorrect = graded && chosen && feedback.isCorrect;
              const chosenWrong = graded && chosen && !feedback.isCorrect;

              return (
                <button
                  key={index}
                  disabled={graded}
                  onClick={() => setSelectedChoice(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition",
                    !graded &&
                      (chosen
                        ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50"),
                    graded && !chosen && "border-gray-200 opacity-50 dark:border-gray-700",
                    chosenCorrect &&
                      "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
                    chosenWrong && "border-red-500 bg-red-50 dark:bg-red-500/10"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold",
                      chosen && !graded
                        ? "border-green-500 text-green-500"
                        : "border-gray-300 text-gray-500 dark:border-gray-600"
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {chosenCorrect && (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  )}
                  {chosenWrong && <XCircle size={18} className="text-red-500" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-5">
            <BlankAnswerInput
              answer={currentQuestion.answer}
              setBlankAnswer={setBlankAnswer}
            />
            {feedback && (
              <div
                className={cn(
                  "mt-4 rounded-xl border px-4 py-3 text-sm",
                  (feedback.percentageCorrect ?? 0) >= 60
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                )}
              >
                Your answer is {feedback.percentageCorrect ?? 0}% similar to the
                correct one. Full answers are revealed in your statistics after
                the quiz.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex justify-end">
        {!feedback ? (
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isChecking || (isMcq && selectedChoice === null)}
          >
            {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Answer
          </Button>
        ) : (
          <Button size="lg" onClick={handleNext}>
            {questionIndex >= questions.length - 1 ? "Finish Quiz" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
