import { db } from "@/configs/db";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import QuizPlay from "../../../_components/QuizPlay";

export default async function MixedQuizPage({ params }) {
  const session = await auth();
  if (!session?.user) {
    return redirect("/sign-in");
  }

  const { gameId } = await params;
  const numericGameId = parseInt(gameId, 10);
  if (!Number.isInteger(numericGameId)) {
    return redirect("/dashboard/quiz");
  }

  const gameData = await db.query.game.findFirst({
    where: (game, { eq }) => eq(game.id, numericGameId),
    with: { questions: true },
  });

  if (!gameData || gameData.gameType !== "mixed") {
    return redirect("/dashboard/quiz");
  }
  // Only the owner may play their game.
  if (gameData.userId !== session.user.id) {
    return redirect("/dashboard/quiz");
  }

  // Don't leak MCQ answers to the client; open-ended items need theirs
  // for the fill-in-the-blanks UI.
  const sanitized = {
    ...gameData,
    questions: gameData.questions.map((q) =>
      q.questionType === "mcq" ? { ...q, answer: undefined } : q
    ),
  };

  return <QuizPlay game={sanitized} />;
}
