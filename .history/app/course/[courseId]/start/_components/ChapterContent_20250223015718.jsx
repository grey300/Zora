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
  // Log the content to see its structure
  console.log("Content received:", content);

  return (
    <div className="p-10">
      <h2 className="font-medium text-2xl">{chapter?.ChapterName}</h2>
      <p className="text-gray-500">{chapter?.About}</p>

      {/* Video */}
      <div className="flex justify-center my-6">
        <YouTube videoId={content?.videoId} opts={opts} />
      </div>

      <div>
        {Array.isArray(content) &&
          content.map((item, index) => (
            <div key={index}>
              <h2 className="font-medium text-lg">{item.title}</h2>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ChapterContent;
