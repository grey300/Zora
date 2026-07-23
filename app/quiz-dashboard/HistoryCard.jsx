"use client";

import React from "react";
import Link from "next/link";
import { History, ArrowRight } from "lucide-react";

function HistoryCard() {
  return (
    <Link
      href="/saved-quizzes"
      className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-[#11151D] dark:hover:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Quizzes
        </h2>
        <History
          size={26}
          strokeWidth={2.25}
          className="text-gray-400 dark:text-gray-500"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        View and replay your past quiz attempts.
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        View history
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

export default HistoryCard;
