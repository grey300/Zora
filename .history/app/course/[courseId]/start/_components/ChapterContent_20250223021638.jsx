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
  console.log("Sections Data:", content?.sections);

  return (
    <div className="p-10">
      <h2 className="font-medium text-2xl">{chapter?.ChapterName}</h2>
      <p className="text-gray-500">{chapter?.About}</p>

      {/* Video */}
      <div className="flex justify-center my-6">
        <YouTube videoId={content?.videoId} opts={opts} />
      </div>

      <div>
        {Array.isArray(content?.content?.sections) &&
          content.content.sections.map((section, index) => (
            <div className="p-5 bg-sky-50 mb-5 rounded-lg" key={index}>
              <h2 className="font-medium text-lg">{section.title}</h2>
              <p className="text-gray-700">{section.description}</p>
              <div className="p-4 bg-black text-green">
                <pre>
                  <code>{section.codeExample}</code>
                </pre>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ChapterContent;
