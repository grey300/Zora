"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import DetailsDialog from "@/components/DetailsDialog";
// import HistoryCard from "@/components/quiz/HistoryCard";
// import HotTopicsCard from "@/components/quiz/HotTopicsCard";
// import QuizMeCard from "@/components/quiz/QuizMeCard";
// import RecentActivityCard from "@/components/quiz/RecentActivityCard";

function Page() {
  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center"></div>
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        {/* <QuizMeCard />
        <HistoryCard /> */}
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        {/* <HotTopicsCard />
        <RecentActivityCard /> */}
      </div>
    </main>
  );
}

export default Page;
