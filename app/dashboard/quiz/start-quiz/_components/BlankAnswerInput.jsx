"use client";

import React from "react";
import keyword_extractor from "keyword-extractor";

const blank = "_____";

export default function BlankAnswerInput({ answer, setBlankAnswer }) {
  const keywords = React.useMemo(() => {
    const words = keyword_extractor.extract(answer, {
      language: "english",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });
    // mix the keywords and pick 2
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [answer]);

  const answerWithBlanks = React.useMemo(() => {
    const answerWithBlanks = keywords.reduce((acc, curr) => {
      return acc.replaceAll(curr, blank);
    }, answer);
    setBlankAnswer(answerWithBlanks);
    return answerWithBlanks;
  }, [answer, keywords, setBlankAnswer]);

  return (
    <div className="flex justify-start w-full mt-4">
      <h1 className="text-xl font-semibold">
        {answerWithBlanks.split(blank).map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index === answerWithBlanks.split(blank).length - 1 ? (
              ""
            ) : (
              <input
                id="user-blank-input"
                className="w-28 border-b-2 border-gray-400 bg-transparent text-center text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-500 dark:text-white dark:focus:border-indigo-400"
                type="text"
              />
            )}
          </React.Fragment>
        ))}
      </h1>
    </div>
  );
}
