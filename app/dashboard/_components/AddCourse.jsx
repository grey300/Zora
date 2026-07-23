"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PlusCircle, BrainCircuit } from "lucide-react";

function AddCourse() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-white p-6 dark:border-gray-800 dark:from-indigo-950/40 dark:via-[#11151D] dark:to-[#11151D] md:p-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
            Kuzuzangpo,{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              {user?.name || "Guest"}
            </span>
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Generate AI-powered courses and quizzes, and share them with friends.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/create-course"
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            <PlusCircle size={18} />
            Create Course
          </Link>
          <Link
            href="/dashboard/quiz"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <BrainCircuit size={18} />
            Take a Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AddCourse;
