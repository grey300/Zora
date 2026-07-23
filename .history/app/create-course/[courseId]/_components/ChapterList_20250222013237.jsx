import React from "react";

function ChapterList({ course }) {
  return (
    <div className="mt-3">
      <h2>Chapters</h2>
      <div className="mt-2">
        {course?.courseOutput?.Chapters.map((chapter, index) => (
          <div>
            <h2>{index + 1}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
