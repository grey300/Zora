"use client";

import React from "react";

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
