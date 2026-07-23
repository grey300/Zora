import React from "react";

function ChapterContent({ chapter, content }) {
  return (
    <div className="p-10">
      <h2>{chapter?.ChapterName}</h2>
    </div>
  );
}

export default ChapterContent;
