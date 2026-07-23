import React from "react";

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
          <h2 className="flex gap-2 items-center p-1 bg-purple-50 text-primary">
            <FaBookOpen />
            {course?.courseOutput?.course?.NoOfChapters} Chapters{" "}
          </h2>
          <h2>{course?.level}</h2>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
