import React from "react";
import Image from "next/image";
function CourseBasicInfo({ course }) {
  return (
    <div className="p-10 border rounded-xl shadow-sm mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h2 className="font-bold text-2xl">
            {course?.courseOutput?.CourseName}
          </h2>
          <h2 className="text-sm text-gray-400 mt-3">
            {course?.courseOutput?.Description}
          </h2>
        </div>
        <div>
          <Image
            src={"/placeholder.png"}
            width={200}
            height={200}
            className="w-full rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

export default CourseBasicInfo;
