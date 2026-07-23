"use client";

import React, { useState } from "react";
import QuizCreation from "../../../quiz-dashboard/_components/QuizCreation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "../../_components/Header";
function StartQuizClient() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <QuizCreation />
    </QueryClientProvider>
  );
}

export default StartQuizClient;
