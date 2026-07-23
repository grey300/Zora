"use client";

import { db } from "@/configs/db";
import { Clock, CopyCheck, Edit2, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function HistoryComponent({ limit, userId }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedGames = await db.query.game.findMany({
          take: limit,
          where: (game, { eq }) => eq(game.userId, userId),
          orderBy: (game) => ({
            desc: game.timeStarted,
          }),
        });
        setGames(fetchedGames ?? []);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load game history.");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [limit, userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader2 className="animate-spin w-6 h-6 text-slate-500" />
        <p className="ml-2 text-slate-500">Loading game history...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8">
      {games.length > 0 ? (
        games.map((game) => (
          <div className="flex items-center justify-between" key={game.id}>
            <div className="flex items-center">
              {game.gameType === "mcq" ? (
                <CopyCheck className="mr-3 text-green-500" />
              ) : (
                <Edit2 className="mr-3 text-blue-500" />
              )}
              <div className="ml-4 space-y-1">
                <Link
                  className="text-base font-medium leading-none underline text-indigo-600 hover:text-indigo-800"
                  href={`/statistics/${game.id}`}
                >
                  {game.topic}
                </Link>
                <p className="flex items-center px-2 py-1 text-xs text-white rounded-lg w-fit bg-slate-800">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(game.timeEnded ?? 0).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-slate-500">No history available.</p>
      )}
    </div>
  );
}
