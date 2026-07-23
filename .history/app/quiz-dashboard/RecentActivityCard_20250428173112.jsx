"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HistoryComponent from "./_components/HistoryComponent"; // ✅ import your HistoryComponent
import { useUser } from "@clerk/nextjs";

function RecentActivityCard() {
  const { isLoaded, user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <CardDescription>You have played a total of 7 quizzes.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-y-auto">
        {/* ✅ Pass userId to HistoryComponent */}
        <HistoryComponent userId={user.id} limit={7} />
      </CardContent>
    </Card>
  );
}

export default RecentActivityCard;
