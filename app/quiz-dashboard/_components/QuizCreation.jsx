"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyCheck, BookOpen, Merge, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import LoadingQuestions from "@/app/quiz-dashboard/_components/LoadingQuestions";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const TYPES = [
  { value: "mcq", label: "Multiple Choice", icon: CopyCheck, desc: "Pick the right option" },
  { value: "open_ended", label: "Fill Blanks", icon: BookOpen, desc: "Type the missing words" },
  { value: "mixed", label: "Mixed", icon: Merge, desc: "Both types combined" },
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy", color: "text-emerald-500 border-emerald-500/50" },
  { value: "medium", label: "Medium", color: "text-amber-500 border-amber-500/50" },
  { value: "hard", label: "Hard", color: "text-red-500 border-red-500/50" },
];

function QuizCreation() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") || "";
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async (input) => {
      if (!userId) throw new Error("User not authenticated");
      const response = await axios.post(`/api/game`, input, {
        withCredentials: true,
      });
      return response.data;
    },
  });

  const form = useForm({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam,
      type: "mcq",
      amount: 5,
      difficulty: "medium",
      focus: "",
    },
  });

  useEffect(() => {
    if (topicParam) form.setValue("topic", topicParam);
  }, [topicParam, form]);

  const onSubmit = async (input) => {
    setLoading(true);
    const { type } = input;
    getQuestions(input, {
      onError: (error) => {
        setLoading(false);
        toast({
          title: "Error",
          description:
            error?.response?.data?.error ||
            "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      },
      onSuccess: ({ gameId }) => {
        setLoading(false);
        const path = type === "open_ended" ? "open-ended" : type;
        router.push(`/dashboard/quiz/start-quiz/play/${path}/${gameId}`);
      },
    });
  };

  if (loading) {
    return <LoadingQuestions finished={loading} />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl py-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#11151D] md:p-8">
        <h1 className="text-2xl font-bold">Create a Quiz</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us what to quiz you on — the AI does the rest.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. World War II, React hooks, Photosynthesis"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quiz type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz type</FormLabel>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {TYPES.map(({ value, label, icon: Icon, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition",
                          field.value === value
                            ? "border-green-500 bg-green-50 dark:bg-green-500/10"
                            : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                        )}
                      >
                        <Icon
                          size={20}
                          className={
                            field.value === value
                              ? "text-green-500"
                              : "text-gray-400"
                          }
                        />
                        <p className="mt-2 text-sm font-semibold">{label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {desc}
                        </p>
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of questions</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={15}
                        {...field}
                        onChange={(e) =>
                          form.setValue("amount", parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormDescription>1–15 questions</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Difficulty */}
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <div className="flex gap-2">
                      {DIFFICULTIES.map(({ value, label, color }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => field.onChange(value)}
                          className={cn(
                            "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition",
                            field.value === value
                              ? color + " bg-current/10"
                              : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-700"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Personalization */}
            <FormField
              control={form.control}
              name="focus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Personalize{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='e.g. "Focus on dates and key battles", "I’m a beginner", "Ask about practical use cases"'
                      className="h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tell the AI what to emphasize or who the quiz is for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading || loading}
            >
              {(isLoading || loading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Generate Quiz
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default QuizCreation;
