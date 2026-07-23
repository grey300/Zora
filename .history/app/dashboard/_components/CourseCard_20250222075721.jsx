import React from "react";
import Image from "next/image";
function CourseCard({ course }) {
  return (
    <div>
      <Image src={course?.courseBanner} width={300} height={200/>
    </div>
  );
}

export default CourseCard;
