"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Plus, Sparkles } from "lucide-react";

function AddCourse() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <section className="page-enter relative overflow-hidden rounded-[2rem] border border-emerald-500/15 bg-gradient-to-br from-emerald-100 via-white to-orange-50 p-7 shadow-[0_24px_80px_rgba(5,150,105,.09)] dark:from-emerald-950/50 dark:via-[#101612] dark:to-orange-950/20 md:p-10">
      <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div className="max-w-xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-white/50 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-emerald-700 backdrop-blur dark:bg-white/5 dark:text-emerald-300"><Sparkles size={13}/> AI learning studio</span>
          <h2 className="text-3xl font-black tracking-[-.04em] text-gray-950 dark:text-white md:text-5xl">
            Kuzuzangpo,{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent dark:from-emerald-300 dark:to-cyan-300">
              {user?.name || "Guest"}
            </span>
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
            What would you like to master today? Build a complete learning path or challenge yourself with a focused quiz.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          <Link
            href="/create-course"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-emerald-700 dark:bg-white dark:text-gray-950 dark:hover:bg-emerald-100"
          >
            <Plus size={18} />
            Create Course
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard/quiz"
            className="flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/55 px-6 py-3.5 text-sm font-bold text-gray-800 backdrop-blur transition hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-gray-100 dark:hover:bg-white/10"
          >
            <BrainCircuit size={18} />
            Take a Quiz
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AddCourse;
