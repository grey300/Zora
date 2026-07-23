import React from "react";
import Image from "next/image";
import { FaBookOpen } from "react-icons/fa6";

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
          <FaBookOpen />
          {course?.courseOutput?.course?.NoOfChapters} Chapters
        </div>
        <div>{course?.level} </div>
      </div>
    </div>
  );
}

export default CourseCard;
