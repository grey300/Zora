import { db } from "@/configs/db";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import QuizPlay from "../../../_components/QuizPlay";

export default async function MCQPage({ params }) {
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
    with: {
      questions: {
        // Never send the answers to the client during play.
        columns: { id: true, question: true, options: true },
      },
    },
  });

  if (!gameData || gameData.gameType !== "mcq") {
    return redirect("/dashboard/quiz");
  }
  // Only the owner may play their game.
  if (gameData.userId !== session.user.id) {
    return redirect("/dashboard/quiz");
  }

  return <QuizPlay game={gameData} />;
}
