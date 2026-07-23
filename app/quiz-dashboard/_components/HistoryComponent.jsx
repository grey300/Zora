"use client";

import { useEffect, useState } from "react";
import { Clock, CopyCheck, Edit2, Merge, History } from "lucide-react"; // Import the Merge icon for mixed games
import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";

export default function HistoryComponent({ userId, limit = 100 }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("HistoryComponent mounted ", userId); // Debugging line
    async function fetchGames() {
      try {
        console.log("dsddsd");

        const res = await fetch(`/api/history?limit=${limit}`);
        const data = await res.json();

        console.log("Fetched games:", data); // Debugging line
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
      console.log("dasdsadas");

      fetchGames();
    }
  }, [userId, limit]);

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">
        Loading your history...
      </p>
    );
  }

  if (games.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No quizzes played yet"
        description="Take your first quiz and your history will appear here."
      />
    );
  }

  return (
    <div className="space-y-8">
      {games.map((game) => (
        <div className="flex items-center justify-between" key={game.id}>
          <div className="flex items-center">
            {game.gameType === "mcq" ? (
              <CopyCheck className="mr-3" />
            ) : game.gameType === "open_ended" ? (
              <Edit2 className="mr-3" />
            ) : game.gameType === "mixed" ? (
              <Merge className="mr-3" /> // Use the Merge icon for mixed games
            ) : null}
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
                  : game.gameType === "open_ended"
                  ? "Open-Ended"
                  : game.gameType === "mixed"
                  ? "Mixed"
                  : null}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
