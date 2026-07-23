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
  <section id="features" className="relative py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Everything you need to learn faster
        </h2>
        <p className="mt-3 text-gray-400">
          Zora combines AI course creation, quizzing, and progress tracking in
          one place.
        </p>
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuresList.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-indigo-500/40 hover:bg-white/[0.05]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
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
