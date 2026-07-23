import React from "react";

function ChapterContent({ chapter, content }) {
  return (
    <div className="p-10">
      <h2 className="font-medium text-2xl">{chapter?.ChapterName}</h2>
      <p>{chapter?.About}</p>
    </div>
  );
}

export default ChapterContent;
