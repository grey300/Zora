import React from "react";
import QuizCreation from "../quiz-dashboard/_components/QuizCreation";
import Header from "../_components/Header";

export const metadata = {
  title: "Quiz | Zora",
  description: "Quiz yourself on anything!",
};

function StartQuiz() {
  return (
    <div>
      <Header />
      <QuizCreation />
    </div>
  );
}

export default StartQuiz;
