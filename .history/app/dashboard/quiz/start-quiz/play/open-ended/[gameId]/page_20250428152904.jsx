import { db } from "@/configs/db";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { game } from "@/configs/schema";
import OpenEnded from "../../../_components/OpenEnded"; 

export default async function OpenEndedPage({ params }) {
  const { gameId } = params;

  console.log("OpenEndedPage loading...");
  console.log("Received gameId:", gameId);

  const gameData = await db.query.game.findFirst({
    where: (game, { eq }) => eq(game.id, parseInt(gameId)),
    with: {
      questions: true,
    },
  });

  console.log("Fetched gameData:", gameData);

  if (!gameData) {
    console.log("No game found! Redirecting to /quiz");
    return redirect("/quiz");
  }

  if (gameData.gameType !== "open_ended") {
    console.log(`Game type mismatch: expected open_ended but got ${gameData.gameType}`);
    return redirect("/quiz");
  }

  return <OpenEnded game={gameData} />;
}
