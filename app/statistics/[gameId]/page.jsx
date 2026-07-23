import { buttonVariants } from "@/components/ui/button";
import { db } from "@/configs/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LucideLayoutDashboard } from "lucide-react";
import { auth } from "@/auth";

import ResultsCard from "@/app/quiz-dashboard/_components/ResultsCard";
import AccuracyCard from "@/app/quiz-dashboard/_components/AccuracyCard";
import TimeTakenCard from "@/app/quiz-dashboard/_components/TimeTakenCard";
import QuestionsList from "@/app/quiz-dashboard/_components/QuestionsList";
import SideBar from "@/app/dashboard/_components/SideBar";
import Header from "@/app/dashboard/_components/Header";

export default async function Statistics({ params }) {
  const session = await auth();
  if (!session?.user) {
    return redirect("/sign-in");
  }

  const { gameId } = await params; // ✅ await to extract param correctly

  const numericGameId = parseInt(gameId);
  if (isNaN(numericGameId) || numericGameId <= 0) {
    console.error("Invalid gameId:", gameId);
    return redirect("/");
  }

  let gameData;
  try {
    gameData = await db.query.game.findFirst({
      where: (game, { eq }) => eq(game.id, numericGameId),
      with: {
        questions: true,
      },
    });
  } catch (error) {
    console.error("Error fetching game data:", error);
    return redirect("/");
  }

  if (!gameData) {
    console.error("Game not found for gameId:", numericGameId);
    return redirect("/");
  }

  // Only the owner (or an admin) can view a game's statistics.
  if (gameData.userId !== session.user.id && session.user.role !== "admin") {
    return redirect("/dashboard");
  }

  let accuracy = 0;
  let mcqCount = 0;
  let openEndedCount = 0;

  gameData.questions.forEach((question) => {
    if (question.questionType === "mcq") {
      if (question.isCorrect) {
        accuracy += 100;
      }
      mcqCount++;
    } else if (question.questionType === "open_ended") {
      accuracy += question.percentageCorrect ?? 0;
      openEndedCount++;
    }
  });

  accuracy =
    mcqCount + openEndedCount > 0
      ? Math.round((accuracy / (mcqCount + openEndedCount)) * 100) / 100
      : 0;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0B0E14]">
      <div className="hidden md:block">
        <SideBar />
      </div>

      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <Header />
        <div className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Quiz Results</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {gameData.topic} · full answers revealed below
              </p>
            </div>
            <Link href="/dashboard/quiz" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2 h-4 w-4" />
              Quiz Hub
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-7">
            <ResultsCard accuracy={accuracy} />
            <AccuracyCard accuracy={accuracy} />
            <TimeTakenCard
              timeEnded={new Date(gameData.timeEnded ?? 0)}
              timeStarted={new Date(gameData.timeStarted ?? 0)}
            />
          </div>

          <QuestionsList questions={gameData.questions} />
        </div>
      </div>
    </div>
  );
}
