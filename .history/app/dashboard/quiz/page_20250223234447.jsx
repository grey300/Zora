import React from "react";
import QuizMeCard from "@/app/quiz-dashboard/QuizMeCard";

function Page() {
  return (
    <main className="p-4 mx-auto max-w-6xl">
      <div className="flex items-center">
        <h2 className="mr-1 text-2xl font-bold tracking-tight">Quiz</h2>
      </div>
      <div className="grid gap-2 mt-2 md:grid-cols-2">
        <QuizMeCard />
        {/* <HistoryCard />  */}
      </div>
      <div className="grid gap-2 mt-2 md:grid-cols-2 lg:grid-cols-7">
        {/* <HotTopicsCard />
        <RecentActivityCard /> */}
      </div>
    </main>
  );
}

export default Page;
