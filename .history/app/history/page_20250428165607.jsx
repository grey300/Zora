import { auth } from "@clerk/nextjs/server";
// import { useAuth } from "@clerk/nextjs";
import HistoryComponent from "@/app/quiz-dashboard/_components/HistoryComponent";

export default async function HistoryPage() {
  const { userId } = await auth(); // Clerk's userId
  // const {userId} = useAuth();
  console.log("HistoryPage userId:", userId); // Debugging line
  return <HistoryComponent userId={userId} />;
}
"use client";

import { useEffect, useState } from "react";
import { Clock, CopyCheck, Edit2 } from "lucide-react";
import Link from "next/link";

export default function HistoryComponent({ userId, limit = 100 }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch(`/api/history?userId=${userId}&limit=${limit}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setGames(data);
        } else {
          console.error("Expected array, got:", data);
          setGames([]);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchGames();
    }
  }, [userId, limit]);

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading your history...</p>;
  }

  if (games.length === 0) {
    return <p className="text-center text-muted-foreground">No games found.</p>;
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div key={game.id} className="p-4 border rounded-lg bg-white shadow-sm flex items-start gap-4">
          {game.gameType === "mcq" ? (
            <CopyCheck className="w-6 h-6 mt-1 text-gray-700" />
          ) : (
            <Edit2 className="w-6 h-6 mt-1 text-gray-700" />
          )}

          <div className="flex-1">
            <Link href={`/statistics/${game.id}`} className="text-lg font-semibold underline">
              {game.topic}
            </Link>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-xs text-white bg-slate-800 rounded-full px-2 py-1">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(game.timeEnded ?? game.timeStarted).toLocaleDateString()}
              </div>

              <p className="text-xs text-muted-foreground">
                {game.gameType === "mcq" ? "MCQ" : "Open Ended"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
