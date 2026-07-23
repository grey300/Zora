import React from "react";
import Image from "next/image";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import EditCourseBasicInfo from "./EditCourseBasicInfo";

function CourseBasicInfo({ course, refreshData }) {
  return (
    <div className="p-10 border rounded-xl shadow-sm mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="font-bold text-2xl">
              {course?.courseOutput?.CourseName}
              <EditCourseBasicInfo
                course={course}
                refreshData={() => refreshData(true)}
              />
            </h2>
            <h2 className="text-sm text-gray-400 mt-3">
              {course?.courseOutput?.Description}
            </h2>
            <h2 className="font-medium mt-2 flex gap-2 items-center text-primary">
              <BiSolidCategoryAlt />
              {course?.category}
            </h2>
          </div>
          <Button className="mt-5 w-full">Start</Button>
        </div>
        <div>
          <Image
            src={"/placeholder.png"}
            width={300}
            height={300}
            className="w-full rounded-xl h-[350px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default CourseBasicInfo;
