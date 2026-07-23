import React from "react";
import Image from "next/image";

function CourseCard({ course }) {
  return (
    <div>
      <Image
        src={course?.courseBanner}
        width={300}
        height={200}
        className="w-full h-[200px] object-cover"
      />
    </div>
  );
}

export default CourseCard;
