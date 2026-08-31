import {
  BookOpen,
  BrainCircuit,
  MessageCircle,
  BarChart3,
  Youtube,
  Compass,
} from "lucide-react";

const featuresList = [
  {
    icon: BookOpen,
    title: "AI Course Generation",
    desc: "Full courses with structured chapters and detailed explanations, generated from a single topic.",
  },
  {
    icon: BrainCircuit,
    title: "Smart Quizzes",
    desc: "Multiple-choice, open-ended, or mixed quizzes on any topic — graded automatically.",
  },
  {
    icon: Youtube,
    title: "Video Lessons",
    desc: "Each chapter is paired with a relevant YouTube video to reinforce learning.",
  },
  {
    icon: MessageCircle,
    title: "AI Study Assistant",
    desc: "A built-in chatbot that answers questions and clears doubts while you learn.",
  },
  {
    icon: BarChart3,
    title: "Progress & Statistics",
    desc: "Accuracy, time taken, and full history for every quiz you play.",
  },
  {
    icon: Compass,
    title: "Explore Community Courses",
    desc: "Browse and learn from courses created by other Zora users.",
  },
];

const Features = () => (
  <section id="features" aria-labelledby="features-title" className="relative overflow-hidden bg-[#05070d] py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">One intelligent workspace</span>
        <h2 id="features-title" className="mt-4 text-2xl font-black tracking-[-.035em] text-white sm:text-4xl">
          Learn at the speed of thought.
        </h2>
        <p className="mt-3 text-sm text-gray-400">
          Zora combines AI course creation, quizzing, and progress tracking in
          one place.
        </p>
      </div>

      <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuresList.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.title}
              className="group relative min-h-56 overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-gradient-to-br from-white/[0.055] to-white/[0.015] p-6 transition duration-500 hover:-translate-y-2 hover:border-emerald-400/25 hover:shadow-[0_30px_80px_rgba(5,150,105,.12)]"
            >
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-500/0 blur-3xl transition group-hover:bg-emerald-500/20" />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-500/15 text-emerald-300 transition group-hover:scale-110 group-hover:bg-emerald-500/25">
                <Icon size={22} />
              </div>
              <h3 className="mt-8 text-base font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-[13px] leading-6 text-gray-400">
                {item.desc}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default Features;
