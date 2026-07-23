"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";
import HistoryComponent from "@/app/quiz-dashboard/_components/HistoryComponent";

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
        console.error("Failed to fetch history:", error);
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
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <p className="text-center text-muted-foreground">
              Loading your history...
            </p>
          ) : (
            <HistoryComponent games={games} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
