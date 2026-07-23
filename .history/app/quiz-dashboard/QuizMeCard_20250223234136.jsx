import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

function QuizMeCard() {
  return (
    <Card
      className="hover:cursor-pointer hover:opacity-75"
      //   onClick={() => {
      //     router.push("/quiz");
      //   }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Quiz me!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Challenge yourself to a quiz with a topic of your choice.
        </p>
      </CardContent>
    </Card>
  );
}

export default QuizMeCard;
