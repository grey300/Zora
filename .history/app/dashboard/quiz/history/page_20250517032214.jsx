"use client";

import { db } from "@/configs/db"; // ← Replacing prisma with drizzle ORM
import { Clock, CopyCheck, Edit2 } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function HistoryComponent({ limit, userId }) {
  let games = [];
  try {
    games = await db.query.game.findMany({
      take: limit,
      where: (game, { eq }) => eq(game.userId, userId),
      orderBy: (game) => ({
        desc: game.timeStarted,
      }),
    });
  } catch (error) {
    console.error("Error fetching games: ", error);
  }
  return (
    <div className="space-y-8">
      {games.length > 0 ? (
        games.map((game) => (
          <div className="flex items-center justify-between" key={game.id}>
            <div className="flex items-center">
              {game.gameType === "mcq" ? (
                <CopyCheck className="mr-3" />
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
        <p>No history available.</p>
      )}
    </div>
  );
}
