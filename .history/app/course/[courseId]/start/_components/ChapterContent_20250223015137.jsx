import React from "react";
import YouTube from "react-youtube";

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 0,
  },
};

function ChapterContent({ chapter, content }) {
  console.log("Chapter Data:", chapter);
  console.log("Content Data:", content);

  return (
    <div className="p-10">
      <h2 className="font-medium text-2xl">{content?.chapterTitle}</h2>
      <p className="text-gray-500">{chapter?.About}</p>

      {/* Video */}
      <div className="flex justify-center my-6">
        {content?.videoId && <YouTube videoId={content.videoId} opts={opts} />}
      </div>

      {/* Display Section Titles */}
      <div>
        {Array.isArray(content?.sections) &&
          content.sections.map((section, index) => (
            <div key={index} className="p-5 bg-sky-50 mb-3 rounded-lg">
              <h2 className="font-medium text-lg">{section.title}</h2>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ChapterContent;
