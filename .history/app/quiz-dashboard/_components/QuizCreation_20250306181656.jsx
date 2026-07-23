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
import axios from "axios";

function QuizCreation() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type }) => {
      // Use a relative path for the API call
      const response = await axios.post(
        "/api/game",
        { amount, topic, type },
        {
          withCredentials: true, // Make sure cookies are sent
        }
      );

      return response.data;
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

  const onSubmit = async (input) => {
    console.log("Form Data:", input);
    setLoading(true);

    try {
      const { topic, type, amount } = input;

      // Optional: Generate quiz with AI
      const PROMPT = `Generate a ${type} quiz about ${topic}. The quiz should have ${amount} questions. Provide the quiz in JSON format.`;
      const result = await GenerateQuizContent_AI.sendMessage(PROMPT);
      const quizData = JSON.parse(result.response?.text());
      console.log("Generated Quiz Data:", quizData);

      // Call the getQuestions mutation with the form data
      getQuestions(input, {
        onError: (error) => {
          setLoading(false);
          console.error("Error creating quiz:", error);
          toast({
            title: "Error",
            description: "Something went wrong. Please try again later.",
            variant: "destructive",
          });
        },
        onSuccess: ({ gameId }) => {
          setLoading(false);
          console.log("Game created successfully with ID:", gameId);

          // Redirect based on quiz type
          if (type === "mcq") {
            router.push(`/dashboard/quiz/start-quiz/play/mcq/${gameId}`);
          } else {
            router.push(`/dashboard/quiz/start-quiz/play/open-ended/${gameId}`);
          }
        },
      });
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    }
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
              <Button disabled={isLoading || loading} type="submit">
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
