import React from "react";

function ChapterListCard({ chapter, index }) {
  return (
    <div className="grid grid-cols-5 p-3">
      <div>
        <h2 className="p-2 bg-primary text-secondary rounded-full">
          {index + 1}
        </h2>
      </div>
      <div></div>
    </div>
  );
}

export default ChapterListCard;
