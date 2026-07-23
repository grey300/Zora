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
  return (
    <div className="p-10">
      <h2 className="font-medium text-2xl">{chapter?.ChapterName}</h2>
      <p className="text-gray-500">{chapter?.About}</p>

      {/* Video */}
      <div className="flex justify-center my-6">
        <YouTube videoId={content?.videoId} opts={opts} />
      </div>

      <div>
        {/* Using content.content directly */}
        <h2 className="font-medium text-2xl mb-4">
          {content?.content?.chapterTitle}
        </h2>
      </div>
    </div>
  );
}

export default ChapterContent;
