import React from "react";

function ChapterList({ course }) {
  return (
    <div className="mt-3">
      <h2>Chapters</h2>
      <div className="mt-2">
        {course?.courseOutput?.Chapters.map((chapter, index) => (
          <div className="">
            <h2 className="bg-primary h-10 w-10 text-white rounded">
              {index + 1}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
