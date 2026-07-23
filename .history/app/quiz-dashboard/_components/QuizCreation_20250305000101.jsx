"use client"; // Ensures this is a client component

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { CopyCheck, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LoadingDialogQ from "@/app/create-quiz/_components/LoadingDialogQ";
import { GenerateQuizContent_AI } from "@/configs/AiModel";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios"; // Ensure axios is imported

function QuizCreation() {
  const [loading, setLoading] = useState(false);

  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type }) => {
      try {
        const response = await axios.post("/api/game", { amount, topic, type });
        console.log("API Response:", response.data); // Log the full response
        return response.data;
      } catch (error) {
        console.error("Error in API request:", error.response?.data || error);
        throw error;
      }
    },
  });

  const form = useForm({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: "",
      type: "open_ended",
      amount: 3,
    },
  });

  const generateQuiz = async (input) => {
    if (!input) return;

    setLoading(true);
    const { topic, type, amount } = input;

    const PROMPT = `Generate a ${type} quiz about ${topic}. The quiz should have ${amount} questions. Provide the quiz in JSON format.`;
    console.log("Quiz Prompt:", PROMPT);

    try {
      // Simulating the quiz generation (you can replace this with the actual logic if needed)
      const result = await GenerateQuizContent_AI.sendMessage(PROMPT);
      const quizData = JSON.parse(result.response?.text());
      console.log("Generated Quiz Data:", quizData);

      // Now, send the quiz data to the backend to create the game and save the quiz
      getQuestions({ amount, topic, type, quizData }); // Call the mutation to handle game creation
    } catch (error) {
      console.error("Error generating quiz:", error);
      setLoading(false);
    }
  };

  const onSubmit = async (input) => {
    console.log("Form Data:", input);

    // First, generate the quiz using AI or some other method
    generateQuiz(input);

    // After generating the quiz, trigger getQuestions with the form data
    setLoading(true);

    getQuestions(input, {
      onError: (error) => {
        setLoading(false);
        if (error.response?.status === 500) {
          toast({
            title: "Error",
            description: "Something went wrong. Please try again later.",
            variant: "destructive",
          });
        }
      },
      onSuccess: ({ gameId }) => {
        setLoading(false);
        setTimeout(() => {
          if (form.getValues("type") === "mcq") {
            // Redirect to the MCQ quiz page
            router.push(`/play/mcq/${gameId}`);
          } else if (form.getValues("type") === "open_ended") {
            // Redirect to the open-ended quiz page
            router.push(`/play/open-ended/${gameId}`);
          }
        }, 2000);
      },
    });
  };

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ">
      <LoadingDialogQ loading={loading} />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter topic" {...field} />
                    </FormControl>
                    <FormDescription>Please provide a topic</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How many questions?"
                        type="number"
                        {...field}
                        onChange={(e) =>
                          form.setValue("amount", parseInt(e.target.value))
                        }
                        min={1}
                        max={10}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose the number of quiz questions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  variant={
                    form.watch("type") === "mcq" ? "default" : "secondary"
                  }
                  className="w-1/2 rounded-none rounded-l-lg"
                  onClick={() => form.setValue("type", "mcq")}
                  type="button"
                >
                  <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  variant={
                    form.watch("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                  className="w-1/2 rounded-none rounded-r-lg"
                  onClick={() => form.setValue("type", "open_ended")}
                  type="button"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                </Button>
              </div>
              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuizCreation;
