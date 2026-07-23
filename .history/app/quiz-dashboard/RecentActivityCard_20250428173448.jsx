"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HistoryComponent from "./_components/HistoryComponent"; // ✅ Correct import
import { useUser } from "@clerk/nextjs";

function RecentActivityCard() {
  const { isLoaded, user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [games, setGames] = useState([]); // ✅ fetch real games

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchGames() {
      if (user?.id) {
        try {
          const res = await fetch(`/api/history?userId=${user.id}&limit=100`);
          const data = await res.json();
          if (Array.isArray(data)) {
            setGames(data);
          } else {
            setGames([]);
          }
        } catch (error) {
          console.error("Failed to fetch games", error);
        }
      }
    }

    fetchGames();
  }, [user?.id]);

  if (!mounted || !isLoaded) {
    return (
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
          <CardDescription>Loading recent quizzes...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
          <CardDescription>
            You must be logged in to view history.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
        <CardDescription>
          You have played a total of{" "}
          <span className="font-semibold">{games.length}</span> quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-y-auto">
        {/* ✅ Pass userId properly */}
        <HistoryComponent userId={user.id} limit={7} />
      </CardContent>
    </Card>
  );
}

export default RecentActivityCard;
