import React from "react";
import QuizCreation from "../quiz-dashboard/_components/QuizCreation";

export const metadata = {
  title: "Quiz | Zora",
  description: "Quiz yourself on anything!",
};

function StartQuiz() {
  return (
    <div>
      <QuizCreation />
    </div>
  );
}

export default StartQuiz;
