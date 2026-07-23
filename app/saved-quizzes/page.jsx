"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SideBar from "../dashboard/_components/SideBar";
import Header from "../dashboard/_components/Header";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CopyCheck,
  Edit2,
  Merge,
  RotateCcw,
  BarChart,
  Loader2,
} from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { format } from "date-fns";

const typeMeta = {
  mcq: { icon: CopyCheck, label: "Multiple Choice" },
  open_ended: { icon: Edit2, label: "Open Ended" },
  mixed: { icon: Merge, label: "Mixed" },
};

export default function SavedQuizzes() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replayingId, setReplayingId] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/history?limit=100`);
        setQuizzes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error.response?.data?.error || "Failed to load quiz history.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [userId, toast]);

  const handleReplay = async (quiz) => {
    const gameTypePath =
      quiz.gameType === "open_ended" ? "open-ended" : quiz.gameType;
    setReplayingId(quiz.id);
    try {
      const response = await axios.post(`/api/replay`, { gameId: quiz.id });
      const { gameId: newGameId } = response.data;
      if (!newGameId) throw new Error("No gameId returned from replay API");
      router.push(`/dashboard/quiz/start-quiz/play/${gameTypePath}/${newGameId}`);
    } catch (error) {
      setReplayingId(null);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to replay quiz.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0B0E14]">
      <div className="hidden md:block">
        <SideBar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Saved Quizzes</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Replay any past quiz with a fresh attempt, or review its results.
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
          ) : quizzes.length === 0 ? (
            <EmptyState
              icon={CopyCheck}
              title="No saved quizzes yet"
              description="Quizzes you play will be saved here for replay."
            />
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => {
                const meta = typeMeta[quiz.gameType] || typeMeta.mcq;
                const Icon = meta.icon;
                const busy = replayingId === quiz.id;
                return (
                  <div
                    key={quiz.id}
                    className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#11151D]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-300">
                      <Icon size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{quiz.topic}</p>
                      <p className="mt-0.5 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {format(
                            new Date(quiz.timeEnded ?? quiz.timeStarted),
                            "MMM d, yyyy"
                          )}
                        </span>
                        <span>{meta.label}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/statistics/${quiz.id}`}
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                        title="View results"
                      >
                        <BarChart size={16} />
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() => handleReplay(quiz)}
                      >
                        {busy ? (
                          <Loader2 size={14} className="mr-2 animate-spin" />
                        ) : (
                          <RotateCcw size={14} className="mr-2" />
                        )}
                        Replay
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
