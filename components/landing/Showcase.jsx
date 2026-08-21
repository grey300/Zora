import Link from "next/link";
import { ArrowRight, Check, Code2, GraduationCap, Landmark, Palette, Sparkles, TrendingUp } from "lucide-react";

const subjects = [
  { icon: Code2, label: "Programming", color: "text-cyan-300" },
  { icon: TrendingUp, label: "Business", color: "text-emerald-300" },
  { icon: Palette, label: "Creative arts", color: "text-orange-300" },
  { icon: Landmark, label: "Humanities", color: "text-amber-300" },
];

export default function Showcase() {
  return (
    <>
      <section className="bg-[#05070d] px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[.2em] text-emerald-300">From prompt to curriculum</span>
            <h2 className="mt-4 text-2xl font-black tracking-[-.03em] text-white sm:text-4xl">A complete course, shaped around you.</h2>
            <p className="mt-4 text-sm leading-6 text-gray-400 sm:text-base">Choose your level, goals, and pace. Zora turns them into a focused learning path you can edit, publish, and revisit anytime.</p>
            <ul className="mt-7 space-y-3 text-sm text-gray-300">
              {["Detailed, structured chapters", "Chapter-aware AI tutor", "Knowledge checks and progress insights"].map((item) => (
                <li key={item} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-emerald-300"><Check size={13}/></span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-[2rem] border border-white/10 bg-[#0b0e18] p-4 shadow-[0_35px_100px_rgba(0,0,0,.45)]">
            <div className="rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-emerald-500/15 to-cyan-500/5 p-6">
              <div className="flex items-center justify-between"><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200">Course blueprint</span><Sparkles size={16} className="text-emerald-300"/></div>
              <h3 className="mt-7 text-lg font-bold text-white">Understanding Machine Learning</h3>
              <p className="mt-2 text-xs leading-5 text-gray-400">Beginner · 6 chapters · Project based</p>
              <div className="mt-6 space-y-2">
                {["Foundations and mental models", "Data and feature thinking", "Training your first model", "Evaluating real-world results"].map((chapter, index) => (
                  <div key={chapter} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 text-xs text-gray-300"><span className="font-mono text-emerald-300">0{index + 1}</span>{chapter}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#05070d] px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl border-y border-white/[0.07] py-16">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><span className="text-[10px] font-bold uppercase tracking-[.2em] text-emerald-300">Explore without limits</span><h2 className="mt-3 text-2xl font-black text-white sm:text-4xl">One studio. Any subject.</h2></div>
            <p className="max-w-md text-sm leading-6 text-gray-500">Start with a single idea and build the exact learning experience you need.</p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map(({ icon: Icon, label, color }) => <div key={label} className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:bg-white/[0.05]"><Icon className={color} size={19}/><span className="text-sm font-semibold text-gray-200">{label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#05070d] px-4 pb-28 pt-10 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-emerald-400/15 bg-gradient-to-br from-emerald-950/80 via-[#0c0e18] to-cyan-950/50 px-6 py-16 text-center sm:px-12">
          <div className="absolute inset-x-0 top-0 mx-auto h-40 max-w-xl bg-emerald-500/20 blur-[80px]" />
          <GraduationCap className="relative mx-auto text-emerald-300" size={30}/>
          <h2 className="relative mx-auto mt-5 max-w-xl text-2xl font-black text-white sm:text-4xl">Your next skill starts with one prompt.</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-400">Create your first personalized course in minutes. No rigid syllabus, no one-size-fits-all path.</p>
          <Link href="/sign-up" className="relative mx-auto mt-7 flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-gray-950 transition hover:-translate-y-1 hover:bg-emerald-100">Start learning free <ArrowRight size={14}/></Link>
        </div>
      </section>
    </>
  );
}
