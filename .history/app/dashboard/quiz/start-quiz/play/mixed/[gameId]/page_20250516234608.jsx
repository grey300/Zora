import { db } from "@/configs/db";
import { redirect } from "next/navigation";
import MCQ from "@/app/dashboard/quiz/_components/MCQ";
import OpenEnded from "@/app/dashboard/quiz/_components/OpenEnded";

// import MCQ from "@/app/dashboard/quiz/_components/MCQ";
// import OpenEnded from "@/app/dashboard/quiz/_components/OpenEnded";

export default async function MixedPage({ params }) {
  const { gameId } = params;

  // 🟢 Fetch game data with questions
  const gameData = await db.query.game.findFirst({
    where: (game, { eq }) => eq(game.id, gameId), // 🛠️ Removed parseInt()
    with: {
      questions: true, // 🛠️ Fetching all questions linked to this game
    },
  });

  // 🔴 If the game is not found or type is not "mixed", redirect to /quiz
  if (!gameData || gameData.gameType !== "mixed") {
    return redirect("/quiz");
  }

  return (
    <div className="space-y-8 p-4">
      {gameData.questions.map((question) => (
        <div key={question.id} className="border p-4 rounded-lg shadow">
          {question.questionType === "mcq" ? (
            <MCQ question={question} />
          ) : (
            <OpenEnded question={question} />
          )}
        </div>
      ))}
    </div>
  );
}
