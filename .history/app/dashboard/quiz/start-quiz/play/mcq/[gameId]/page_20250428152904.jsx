import { db } from "@/configs/db"; // drizzle db
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { game, Question } from "@/configs/schema";
import MCQ from "../../../_components/MCQ"; // correct import

export default async function MCQPage({ params }) {
  const { gameId } = params;

  const gameData = await db.query.game.findFirst({
    where: (game, { eq }) => eq(game.id, parseInt(gameId)),
    with: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });

  if (!gameData || gameData.gameType === "open_ended") {
    return redirect("/quiz");
  }

  return <MCQ game={gameData} />;
}
