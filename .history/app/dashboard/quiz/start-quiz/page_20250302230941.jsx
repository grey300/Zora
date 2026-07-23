"use client";

import React, { useState } from "react";
import QuizCreation from "../../../quiz-dashboard/_components/QuizCreation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function StartQuizClient() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <QuizCreation />
    </QueryClientProvider>
  );
}

export default StartQuizClient;
