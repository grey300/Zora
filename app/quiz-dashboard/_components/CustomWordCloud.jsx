"use client";

import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

const fontSizeMapper = (word) => Math.log2(word.value) * 5 + 16;

function CustomWordCloud({ formattedTopics }) {
  const router = useRouter();

  const handleWordClick = (event, word) => {
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
      words={(words) =>
        words.map((word) => ({
          ...word,
          style: {
            cursor: "pointer",
            fill: "black",
            ...word.style,
          },
        }))
      }
    />
  );
}

export default CustomWordCloud;
