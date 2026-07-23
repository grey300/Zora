import React from "react";

function ChapterListCard({ chapter, index }) {
  return (
    <div className="grid grid-cols-5 p-3">
      <div>
        <h2 className="p-3 bg-primary text-secondary rounded-full text-center">
          {index + 1}
        </h2>
      </div>
      <div className="col-span-4">
        <h2>{chapter?.name}</h2>
      </div>
    </div>
  );
}

export default ChapterListCard;
