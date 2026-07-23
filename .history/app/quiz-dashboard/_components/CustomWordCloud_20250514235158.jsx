"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import D3WordCloud from "react-d3-cloud";

// Font size mapper for words based on frequency
const fontSizeMapper = (word) => Math.log2(word.value) * 5 + 16;

function CustomWordCloud() {
  const [formattedTopics, setFormattedTopics] = useState([]);
  const router = useRouter();

  // Fetch the topics data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getTopicsForWordCloud");
      const data = await response.json();
      setFormattedTopics(data); // Set the fetched data as word cloud topics
    };

    fetchData();
  }, []);

  // Define how words should behave when clicked
  const handleWordClick = (event, word) => {
    // Redirect to quiz page with the selected topic's gameId (quizId)
    const quizId = word.quizId;

    if (quizId) {
      // Redirect to the quiz page where the quizId will be used to fetch the quiz questions
      router.push(`/dashboard/quiz/start-quiz/play/mcq/${quizId}`);
    }
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
          style: {
            cursor: "pointer", // Apply pointer cursor here
            fill: "black", // Set all word colors to black
            ...word.style,
          },
        }))
      }
    />
  );
}

export default CustomWordCloud;
