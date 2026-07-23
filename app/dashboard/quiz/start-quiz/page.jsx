// app/dashboard/quiz/start-quiz/page.jsx
"use client";

import React, { useState, Suspense } from "react"; // Add Suspense import
import QuizCreation from "../../../quiz-dashboard/_components/QuizCreation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function QuizCreationWrapper() {
  return (
    <Suspense fallback={<div>Loading quiz...</div>}>
      <QuizCreation />
    </Suspense>
  );
}

export default function StartQuizClient() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <QuizCreationWrapper />
    </QueryClientProvider>
  );
}
