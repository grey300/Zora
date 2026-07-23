"use client";

import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

// Font size mapper based on word frequency
const fontSizeMapper = (word) => Math.log2(word.value) * 5 + 16;

function CustomWordCloud({ formattedTopics }) {
  const router = useRouter();

  return (
    <D3WordCloud
      data={formattedTopics}
      height={550}
      font="Times"
      fontSize={fontSizeMapper}
      rotate={0}
      padding={10}
      onWordClick={(event, word) => {
        // Redirect to quiz page with selected topic in query params
        router.push(`/dashboard/quiz/start-quiz?topic=${word.text}`);
      }}
    />
  );
}

export default CustomWordCloud;
