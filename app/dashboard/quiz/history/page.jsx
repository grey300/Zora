"use client";

import { useEffect, useState } from "react";
import { Clock, CopyCheck, Edit2, Merge, History } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";

export default function QuizHistoryPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch("/api/history?limit=100");
        const data = await res.json();
        setGames(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching games:", error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  if (loading) {
    return (
      <p className="p-8 text-center text-muted-foreground">
        Loading your history...
      </p>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Quiz History</h2>
      {games.length === 0 ? (
        <EmptyState
          icon={History}
          title="No quizzes played yet"
          description="Take your first quiz and your history will appear here."
        />
      ) : (
        games.map((game) => (
          <div className="flex items-center justify-between" key={game.id}>
            <div className="flex items-center">
              {game.gameType === "mcq" ? (
                <CopyCheck className="mr-3" />
              ) : game.gameType === "mixed" ? (
                <Merge className="mr-3" />
              ) : (
                <Edit2 className="mr-3" />
              )}
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none underline"
                  href={`/statistics/${game.id}`}
                >
                  {game.topic}
                </Link>
                <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(
                    game.timeEnded ?? game.timeStarted
                  ).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {game.gameType === "mcq"
                    ? "Multiple Choice"
                    : game.gameType === "mixed"
                    ? "Mixed"
                    : "Open-Ended"}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
