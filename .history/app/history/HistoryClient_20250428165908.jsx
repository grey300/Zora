"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Clock, CopyCheck, Edit2 } from "lucide-react";

export default function HistoryClient({ userId }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch(`/api/history?userId=${userId}`);
        const data = await res.json();
        setGames(data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchGames();
    }
  }, [userId]);

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[90vw] max-w-md">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">History</CardTitle>
            <Link className={buttonVariants()} href="/dashboard">
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </CardHeader>

        <CardContent className="max-h-[60vh] overflow-y-auto space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading your history...
            </p>
          ) : games.length === 0 ? (
            <p className="text-center text-muted-foreground">No games found.</p>
          ) : (
            games.map((game) => (
              <div
                key={game.id}
                className="p-4 border rounded-lg bg-white shadow-sm flex items-start gap-4"
              >
                {game.gameType === "mcq" ? (
                  <CopyCheck className="w-6 h-6 mt-1 text-gray-700" />
                ) : (
                  <Edit2 className="w-6 h-6 mt-1 text-gray-700" />
                )}

                <div className="flex-1">
                  <Link
                    href={`/statistics/${game.id}`}
                    className="text-lg font-semibold underline"
                  >
                    {game.topic}
                  </Link>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-xs text-white bg-slate-800 rounded-full px-2 py-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(
                        game.timeEnded ?? game.timeStarted
                      ).toLocaleDateString()}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {game.gameType === "mcq" ? "MCQ" : "Open Ended"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
