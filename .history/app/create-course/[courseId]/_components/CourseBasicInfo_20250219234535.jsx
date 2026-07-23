import React from "react";

function CourseBasicInfo({ course }) {
  console.log("Course Data in CourseBasicInfo:", course);
  console.log("Course Output Data:", course?.courseOutput);
  console.log("Course Name:", course?.courseOutput?.course?.name);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <h2>
            {course?.courseOutput?.course?.name || "No Course Name Found"}
          </h2>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default CourseBasicInfo;
