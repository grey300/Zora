import React from "react";
import { GiSkills, GiDuration } from "react-icons/gi";
import { RiSortNumberDesc } from "react-icons/ri";
function CourseDetails({ course }) {
  return (
    <div className="border p-6 rounded-xl shadow-sm mt-3">
      <div className="grid grid-cols-2 md:grid-cols-4">
        <div className="flex gap-2">
          <GiSkills className="text-4xl text-primary" />
          <div>
            <h2 className="text-xs text-gray-500">Skill Level</h2>
            <h2 className="font-medium text-lg">{course?.level}</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <GiDuration className="text-4xl text-primary" />
          <div>
            <h2 className="text-xs text-gray-500">Duration</h2>
            <h2 className="font-medium text-lg">
              {course?.courseOutput?.TotalDuration}
            </h2>
          </div>
        </div>
        <div className="flex gap-2">
          <RiSortNumberDesc className="text-4xl text-primary" />
          <div>
            <h2 className="text-xs text-gray-500">Number of Chapters</h2>
            <h2 className="font-medium text-lg">
              {course?.courseOutput?.NoOfChapters}
            </h2>
          </div>
        </div>
        <div className="flex gap-2">
          <GiSkills className="text-4xl text-primary" />
          <div>
            <h2 className="text-xs text-gray-500">Video Included</h2>
            <h2 className="font-medium text-lg">{course?.includeVideo}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
