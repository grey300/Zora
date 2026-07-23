"use client";

import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

// Font size mapper for words based on frequency
const fontSizeMapper = (word) => Math.log2(word.value) * 5 + 16;

function CustomWordCloud({ formattedTopics }) {
  const router = useRouter();

  // Define how words should behave when clicked
  const handleWordClick = (event, word) => {
    // Redirect to quiz page with the selected topic in query params
    router.push(`/dashboard/quiz/start-quiz?topic=${word.text}`);
  };

  return (
    <D3WordCloud
      data={formattedTopics}
      height={550}
      font="Times"
      fontSize={fontSizeMapper}
      rotate={0}
      padding={10}
      onWordClick={handleWordClick}
      // Customize the rendering of each word
      words={(words) =>
        words.map((word) => ({
          ...word,
          style: { cursor: "pointer", ...word.style }, // Apply pointer cursor here
        }))
      }
    />
  );
}

export default CustomWordCloud;
