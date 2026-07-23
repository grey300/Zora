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
  console.log("Content received:", content);

  return (
    <div className="p-10">
      <h2 className="font-medium text-2xl">{chapter?.chapterTitle}</h2>

      {/* Video */}
      <div className="flex justify-center my-6">
        {content?.videoId && <YouTube videoId={content.videoId} opts={opts} />}
      </div>

      {/* List of Sections */}
      <div>
        {Array.isArray(content?.sections) &&
          content.sections.map((section, index) => (
            <div key={index} className="p-3 bg-gray-100 rounded-md my-2">
              <h2 className="font-medium text-lg">{section.title}</h2>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ChapterContent;
