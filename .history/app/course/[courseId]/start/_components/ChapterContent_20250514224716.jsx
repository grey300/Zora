import React from "react";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 0,
  },
};

export default function ChapterContent({ chapter, content }) {
  console.log("Chapter:", chapter);
  console.log("Content:", content);

  return (
    <div className="p-10">
      <h2 className="font-medium text-2xl">
        {chapter?.ChapterName || "No Chapter Selected"}
      </h2>
      <p className="text-gray-500">
        {chapter?.About || "No description available"}
      </p>

      {/* Video */}
      {content?.videoId ? (
        <div className="flex justify-center my-6">
          <YouTube videoId={content.videoId} opts={opts} />
        </div>
      ) : (
        <p className="text-gray-500 my-6">No video available</p>
      )}

      {/* Sections */}
      {content?.content?.sections?.length > 0 ? (
        content.content.sections.map((section, index) => (
          <div className="p-5 bg-sky-50 mb-5 rounded-lg" key={index}>
            <h2 className="font-medium text-lg">
              {section.title || "Untitled Section"}
            </h2>
            <ReactMarkdown>
              {section.description || "No description"}
            </ReactMarkdown>
            {section.codeExample && (
              <div className="p-4 bg-black text-green-600 rounded-md mt-3">
                <pre>
                  <code>{section.codeExample}</code>
                </pre>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No sections available</p>
      )}
    </div>
  );
}
