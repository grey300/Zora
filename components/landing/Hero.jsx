import Link from "next/link";
import { ArrowRight, BookOpenCheck, BrainCircuit, Play, Sparkles } from "lucide-react";

const Hero = () => (
  <section className="relative min-h-[820px] overflow-hidden bg-[#05070d]">
    {/* Glow */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[-180px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-600/30 blur-[140px]"
    />
    <div aria-hidden className="pointer-events-none absolute right-[-12rem] top-80 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.18] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

    <div className="page-enter relative mx-auto max-w-7xl px-4 pb-24 pt-36 text-center sm:px-6 sm:pt-44">
      <span className="mx-auto flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-200 shadow-lg shadow-emerald-950/20">
        <Sparkles size={14} />
        AI-powered learning platform
      </span>

      <h1 className="mx-auto mt-7 max-w-3xl text-3xl font-black leading-[1.04] tracking-[-.04em] text-white sm:text-5xl lg:text-[4.35rem]">
        Turn curiosity into{" "}
        <span className="bg-gradient-to-r from-emerald-300 via-orange-300 to-cyan-300 bg-clip-text text-transparent">
          real knowledge.
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-lg text-[13px] leading-6 text-gray-400 sm:text-base sm:leading-7">
        Your personal AI learning studio. Create beautifully structured courses,
        study with an intelligent tutor, and prove what you know.
      </p>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/sign-up"
          className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-gray-950 shadow-[0_14px_40px_rgba(255,255,255,.12)] transition hover:-translate-y-1 hover:bg-emerald-100 sm:w-auto"
        >
          Start learning free
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/sign-in"
          className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-7 py-3.5 text-sm font-semibold text-gray-200 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10 sm:w-auto"
        >
          <Play size={15} fill="currentColor" />
          Sign in
        </Link>
      </div>

      {/* Steps strip */}
      <div
        id="how-it-works"
        className="relative mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-3 rounded-[2rem] border border-white/10 bg-white/[0.035] p-3 text-left shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-xl sm:grid-cols-3"
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
            className="group rounded-2xl border border-transparent p-6 transition duration-300 hover:border-white/10 hover:bg-white/[0.055]"
          >
            <span className="font-mono text-xs font-bold text-emerald-300">/{item.step}</span>
            <h3 className="mt-4 text-sm font-bold text-white">{item.title}</h3>
            <p className="mt-2 text-xs leading-5 text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Hero;
