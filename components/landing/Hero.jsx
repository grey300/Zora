import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => (
  <section className="relative overflow-hidden">
    {/* Glow */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[420px] max-w-3xl bg-indigo-600/20 blur-[120px]"
    />

    <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-24 text-center sm:px-6 sm:pt-32">
      <span className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-indigo-300">
        <Sparkles size={14} />
        AI-powered learning platform
      </span>

      <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
        Learn anything with{" "}
        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          AI-generated courses
        </span>{" "}
        &amp; quizzes
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-base text-gray-400 sm:text-lg">
        Type a topic — Zora builds a full course with chapters, videos, and
        quizzes in minutes. Track your progress and test yourself as you go.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/sign-up"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:w-auto"
        >
          Start learning free
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/sign-in"
          className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/10 sm:w-auto"
        >
          Sign in
        </Link>
      </div>

      {/* Steps strip */}
      <div
        id="how-it-works"
        className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3"
      >
        {[
          {
            step: "01",
            title: "Pick a topic",
            desc: "Choose any subject, level, and course length.",
          },
          {
            step: "02",
            title: "AI builds your course",
            desc: "Chapters, explanations, and videos — generated in minutes.",
          },
          {
            step: "03",
            title: "Learn & quiz yourself",
            desc: "Study each chapter, then test yourself with AI quizzes.",
          },
        ].map((item) => (
          <div
            key={item.step}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <span className="text-sm font-bold text-indigo-400">{item.step}</span>
            <h3 className="mt-2 font-semibold text-white">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Hero;
