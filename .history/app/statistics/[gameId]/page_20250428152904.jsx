import { buttonVariants } from "@/components/ui/button";
import { db } from "@/configs/db"; // Replacing prisma with your drizzle db
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { LucideLayoutDashboard } from "lucide-react";

import ResultsCard from "@/app/quiz-dashboard/_components/ResultsCard"; // ✅
import AccuracyCard from "@/app/quiz-dashboard/_components/AccuracyCard"; // ✅
import TimeTakenCard from "@/app/quiz-dashboard/_components/TimeTakenCard"; // ✅
import QuestionsList from "@/app/quiz-dashboard/_components/QuestionsList"; // ✅

export default async function Statistics({ params }) {
  const { gameId } = params;

  const gameData = await db.query.game.findFirst({
    where: (game, { eq }) => eq(game.id, parseInt(gameId)),
    with: {
      questions: true,
    },
  });

  if (!gameData) {
    return redirect("/");
  }

  let accuracy = 0;

  if (gameData.gameType === "mcq") {
    let totalCorrect = gameData.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    accuracy = (totalCorrect / gameData.questions.length) * 100;
  } else if (gameData.gameType === "open_ended") {
    let totalPercentage = gameData.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);
    accuracy = totalPercentage / gameData.questions.length;
  }

  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Summary</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard" className={buttonVariants()}>
            <LucideLayoutDashboard className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-7">
        <ResultsCard accuracy={accuracy} />
        <AccuracyCard accuracy={accuracy} />
        <TimeTakenCard
          timeEnded={new Date(gameData.timeEnded ?? 0)}
          timeStarted={new Date(gameData.timeStarted ?? 0)}
        />
      </div>

      <QuestionsList questions={gameData.questions} />
    </div>
  );
}
