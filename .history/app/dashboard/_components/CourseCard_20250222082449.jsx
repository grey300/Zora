import React from "react";
import Image from "next/image";

function CourseCard({ course }) {
  return (
    <div className="shadow-sm rounded-lg">
      <Image
        src={course?.courseBanner}
        width={300}
        height={200}
        className="w-full h-[200px] object-cover rounded-lg"
      />
      <div className="p-2">
        <h2 className="font-medium text-lg">
          {course?.courseOutput?.course?.name}
        </h2>
        <div>
          {course?.courseOutput?.course?.NoOfChapters} Chapters
          <h2>{course?.level}</h2>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
