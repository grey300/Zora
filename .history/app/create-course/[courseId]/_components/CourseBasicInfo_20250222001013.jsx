import React from "react";

function CourseBasicInfo({ course }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <h2>{course?.courseOutput?.CourseName}</h2>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default CourseBasicInfo;
