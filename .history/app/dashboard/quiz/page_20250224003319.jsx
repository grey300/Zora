import React from "react";
import QuizMeCard from "@/app/quiz-dashboard/QuizMeCard";
import HistoryCard from "@/app/quiz-dashboard/HistoryCard";
import HotTopicsCard from "@/app/quiz-dashboard/HotTopicsCard";
function Page() {
  return (
    <main className="p-1 mx-auto max-w-9xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Quiz</h2>
      </div>
      <div className="grid gap-2 mt-2 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className="grid gap-2 mt-2 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </main>
  );
}

export default Page;
