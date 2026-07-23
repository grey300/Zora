import React from "react";

function CourseBasicInfo({ course }) {
  return (
    <div className="p-10 border rounded-xl shadow-sm mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <h2 className="font-bold text-2xl">
            {course?.courseOutput?.CourseName}
          </h2>
          <h2>{course?.courseOutput?.Description}</h2>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default CourseBasicInfo;
