import { db } from "@/configs/db"; // drizzle db
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { game, Question } from "@/configs/schema";
import MCQ from "@/app/dashboard/quiz/_components/MCQ";
export default async function MCQPage({ params }) {
  // Ensure params are awaited before accessing gameId
  const { gameId } = params;

  // Fetch game data based on the gameId
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

  // Redirect if no gameData is found or if the game is open-ended
  if (!gameData || gameData.gameType === "open_ended") {
    return redirect("/quiz");
  }

  // Render the MCQ component with the game data
  return <MCQ game={gameData} />;
}
