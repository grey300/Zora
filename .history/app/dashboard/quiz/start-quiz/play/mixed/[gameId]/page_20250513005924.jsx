import { db } from "@/configs/db";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { game } from "@/configs/schema";
import MCQ from "../../../_components/MCQ";
import OpenEnded from "../../../_components/OpenEnded";

export default async function MixedPage({ params }) {
  const { gameId } = params;

  const gameData = await db.query.game.findFirst({
    where: (game, { eq }) => eq(game.id, parseInt(gameId)),
    with: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
          type: true, // <-- Added this to know the question type
        },
      },
    },
  });

  if (!gameData || gameData.gameType !== "mixed") {
    return redirect("/quiz");
  }

  return (
    <div className="space-y-8">
      {gameData.questions.map((question, index) => (
        <div key={question.id}>
          {question.type === "mcq" ? (
            <MCQ question={question} />
          ) : (
            <OpenEnded question={question} />
          )}
        </div>
      ))}
    </div>
  );
}
