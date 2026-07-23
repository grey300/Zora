"use client";
import React, { useState, useContext } from "react";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "@/app/_context/UserInputContext";
import LoadingDialog from "./_components/LoadingDialog";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 0, name: "Category", icon: HiMiniSquares2X2 },
  { id: 1, name: "Topic & Goals", icon: HiOutlineLightBulb },
  { id: 2, name: "Options", icon: HiClipboardDocumentCheck },
];

function CreateCourse() {
  const { userCourseInput } = useContext(UserInputContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const stepIncomplete = () => {
    if (!userCourseInput) return true;
    if (activeIndex === 0) return !userCourseInput.category?.trim();
    if (activeIndex === 1) return !userCourseInput.topic?.trim();
    if (activeIndex === 2) {
      return (
        !userCourseInput.level ||
        !userCourseInput.duration ||
        !userCourseInput.displayVideo ||
        !userCourseInput.noOfChapters
      );
    }
    return false;
  };

  const GenerateCourseLayout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: userCourseInput?.category,
          topic: userCourseInput?.topic,
          level: userCourseInput?.level,
          duration: userCourseInput?.duration,
          displayVideo: userCourseInput?.displayVideo,
          noOfChapters: userCourseInput?.noOfChapters,
          description: userCourseInput?.description || "",
          audience: userCourseInput?.audience || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Course generation failed.");
      }
      router.replace("/create-course/" + data.courseId);
    } catch (err) {
      console.error("Course generation failed:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      {/* Heading */}
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-bold">Create a Course</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Three quick steps — then the AI builds your course.
        </p>
      </div>

      {/* Stepper */}
      <div className="mt-8 flex items-center justify-center">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const done = activeIndex > index;
          const active = activeIndex === index;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-lg transition-all duration-300 ${
                    done
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : active
                      ? "border-indigo-500 bg-indigo-50 text-indigo-500 dark:bg-indigo-500/15"
                      : "border-gray-300 text-gray-400 dark:border-gray-700"
                  }`}
                >
                  {done ? <Check size={20} /> : <Icon />}
                </div>
                <span
                  className={`mt-2 hidden text-xs font-medium md:block ${
                    active || done ? "text-indigo-500" : "text-gray-400"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 mb-5 h-0.5 w-16 rounded-full transition-all duration-300 md:w-28 ${
                    activeIndex > index
                      ? "bg-indigo-500"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step body */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#11151D] md:p-8">
        {error && (
          <p className="mb-4 rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </p>
        )}

        {activeIndex === 0 ? (
          <SelectCategory />
        ) : activeIndex === 1 ? (
          <TopicDescription />
        ) : (
          <SelectOption />
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            disabled={activeIndex === 0 || loading}
            variant="outline"
            onClick={() => setActiveIndex(activeIndex - 1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          {activeIndex < 2 ? (
            <Button
              disabled={stepIncomplete()}
              onClick={() => setActiveIndex(activeIndex + 1)}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              disabled={stepIncomplete() || loading}
              onClick={GenerateCourseLayout}
              className="bg-indigo-600 hover:bg-indigo-500"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Course Layout
            </Button>
          )}
        </div>
      </div>

      <LoadingDialog loading={loading} />
    </div>
  );
}

export default CreateCourse;
