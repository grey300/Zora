import React from "react";
import QuizMeCard from "@/app/quiz-dashboard/QuizMeCard";
import HistoryCard from "@/app/quiz-dashboard/HistoryCard";
import HotTopicsCard from "@/app/quiz-dashboard/HotTopicsCard";
import RecentActivityCard from "@/app/quiz-dashboard/RecentActivityCard";
function Page() {
  return (
    <main className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Quiz Hub</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Test yourself with AI-generated quizzes on any topic.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </main>
  );
}

export default Page;
