"use client";

import React from "react";
import Link from "next/link";
import { BrainCircuit, ArrowRight } from "lucide-react";

function QuizMeCard() {
  return (
    <Link
      href="/dashboard/quiz/start-quiz"
      className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Quiz me!</h2>
        <BrainCircuit size={26} strokeWidth={2.25} className="opacity-90" />
      </div>
      <p className="mt-2 text-sm text-green-100">
        Challenge yourself to a quiz with a topic of your choice.
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
        Start a quiz
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

export default QuizMeCard;
