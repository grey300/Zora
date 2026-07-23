"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  CopyCheck,
  Edit2,
  Merge,
  History,
  ChevronRight,
} from "lucide-react";
import EmptyState from "@/components/common/EmptyState";

const typeMeta = {
  mcq: { icon: CopyCheck, label: "Multiple Choice" },
  open_ended: { icon: Edit2, label: "Open Ended" },
  mixed: { icon: Merge, label: "Mixed" },
};

export default function HistoryClient({ userId }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch(`/api/history`);
        const data = await res.json();
        setGames(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Quiz History</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Every quiz you&apos;ve played — tap one to see its results.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
      ) : games.length === 0 ? (
        <EmptyState
          icon={History}
          title="No quiz history yet"
          description="Play a quiz to see it listed here."
        />
      ) : (
        <div className="space-y-3">
          {games.map((game) => {
            const meta = typeMeta[game.gameType] || typeMeta.mcq;
            const Icon = meta.icon;
            return (
              <Link
                key={game.id}
                href={`/statistics/${game.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-gray-800 dark:bg-[#11151D] dark:hover:border-indigo-500/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">
                    {game.topic}
                  </span>
                  <span className="mt-0.5 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(
                        game.timeEnded ?? game.timeStarted
                      ).toLocaleDateString()}
                    </span>
                    <span>{meta.label}</span>
                  </span>
                </span>
                <ChevronRight
                  size={18}
                  className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-400 dark:text-gray-600"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
