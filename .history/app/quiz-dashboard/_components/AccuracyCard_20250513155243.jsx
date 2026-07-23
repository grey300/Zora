import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

const AccuracyCard = ({ questions }) => {
  // Check if questions is undefined or not an array
  if (!Array.isArray(questions)) {
    return (
      <Card className="md:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-2xl font-bold">Average Accuracy</CardTitle>
          <Target />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">No data available</div>
        </CardContent>
      </Card>
    );
  }

  // Filter out unanswered or incorrect questions
  const answeredQuestions = questions.filter((q) => q.userAnswer); // Filter questions where the user provided an answer
  const correctAnswers = answeredQuestions.filter((q) => q.isCorrect); // Count only the correct answers

  // Calculate the accuracy percentage
  const accuracy =
    answeredQuestions.length > 0
      ? (correctAnswers.length / answeredQuestions.length) * 100
      : 0;

  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Average Accuracy</CardTitle>
        <Target />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{accuracy.toFixed(2)}%</div>
      </CardContent>
    </Card>
  );
};

export default AccuracyCard;
