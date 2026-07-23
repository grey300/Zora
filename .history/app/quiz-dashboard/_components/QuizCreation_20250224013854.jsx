"use client"; // ✅ Add this at the top

import React from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form"; // ✅ Now this will work
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // ✅ Import zod if using TypeScript

type Input = z.infer<typeof quizCreationSchema>;

function QuizCreation() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") || ""; // ✅ Fix undefined error

  const form =
    useForm <
    Input >
    {
      resolver: zodResolver(quizCreationSchema),
      defaultValues: {
        topic: topicParam,
        type: "mcq",
        amount: 3,
      },
    };

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>{/* Form content goes here */}</CardContent>
      </Card>
    </div>
  );
}

export default QuizCreation;
