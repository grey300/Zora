"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { BrainCircuit } from "lucide-react";

const loadingTexts = [
  "Generating questions…",
  "Crafting tricky distractors…",
  "Balancing the difficulty…",
  "Double-checking the answers…",
  "Shuffling the options…",
];

const LoadingQuestions = ({ finished }) => {
  const [progress, setProgress] = React.useState(10);
  const [textIndex, setTextIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((i) => (i + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100;
        if (prev >= 95) return 95;
        return prev + (Math.random() < 0.1 ? 2 : 0.5);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [finished]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6">
      {/* Pulsing brain orb */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500/25" />
        <span className="absolute inline-flex h-[68px] w-[68px] rounded-full bg-indigo-500/20" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white">
          <BrainCircuit size={26} className="animate-pulse" />
        </span>
      </div>

      <h2 className="mt-6 text-lg font-semibold">Building your quiz</h2>
      <p className="mt-1 h-5 text-sm text-muted-foreground">
        {loadingTexts[textIndex]}
      </p>
      <Progress value={progress} className="mt-5 w-full max-w-sm" />
    </div>
  );
};

export default LoadingQuestions;
