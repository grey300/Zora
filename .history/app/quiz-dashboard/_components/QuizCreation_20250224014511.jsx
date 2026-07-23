"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { zodResolver } from "@hookform/resolvers/zod";

function QuizCreation() {
  const form = useForm({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: "",
      type: "open_ended",
      amount: 3,
    },
  });

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}

export default QuizCreation;
