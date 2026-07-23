import React from "react";
import QuizMeCard from "@/app/quiz-dashboard/QuizMeCard";
function Page() {
  return (
    <main className="p-8 mx-auto max-w-9xl">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Quiz</h2>
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        {/* <HistoryCard />  */}
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        {/* <HotTopicsCard />
        <RecentActivityCard /> */}
      </div>
    </main>
  );
}

export default Page;
