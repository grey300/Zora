import React from "react";

function ChapterList({ course }) {
  return (
    <div className="mt-3">
      <h2>Chapters</h2>
      <div className="mt-2">
        {course?.courseOutput?.Chapters.map((chapter, index) => (
          <div className="flex gap-2 items-center">
            <h2 className="bg-primary h-10 w-10 text-white rounded-full text-center p-2">
              {index + 1}
            </h2>
            <div>
              <h2>{course?.courseOutput?.CourseName}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
