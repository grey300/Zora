import React from "react";

function ChapterContent({ chapter, content }) {
  return (
    <div className="p-10">
      <h2 className="font-medium text-2xl">{chapter?.ChapterName}</h2>
      <p className="text-gray-500">{chapter?.About}</p>

      {/* Video */}

      {/* Content */}
    </div>
  );
}

export default ChapterContent;
