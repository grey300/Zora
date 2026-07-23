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

        <div className="flex itms-center justify-between">
          <p className="tetx-sm text-gray-400">{course?.category}</p>
          <h2 className="flex gap-2 items-center p-1 bg-purple-50 text-primary text-sm rounded-sm">
            <FaBookOpen />
            {course?.courseOutput?.course?.NoOfChapters} Chapters{" "}
          </h2>
          <h2 className="text-sm bg-purple-50 text-primary p-1 rounded-sm">
            {course?.level}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
