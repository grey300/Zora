"use client";

import { useEffect, useState } from "react";
import HistoryComponent from "@/app/quiz-dashboard/_components/HistoryComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";

export default function HistoryClient({ userId }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      const res = await fetch(`/api/history?userId=${userId}`);
      const data = await res.json();
      setGames(data);
    }
    fetchGames();
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
        <CardContent className="max-h-[60vh] overflow-y-auto">
          <HistoryComponent games={games} />
        </CardContent>
      </Card>
    </div>
  );
}
