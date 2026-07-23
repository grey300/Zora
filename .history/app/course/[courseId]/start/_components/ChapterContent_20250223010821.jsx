import React from "react";
import YouTube from "react-youtube";
function ChapterContent({ chapter, content }) {
  return (
    <div className="p-10">
      <h2 className="font-medium text-2xl">{chapter?.ChapterName}</h2>
      <p className="text-gray-500">{chapter?.About}</p>

      {/* Video */}
      <YouTube />
      {/* Content */}
    </div>
  );
}

export default ChapterContent;
