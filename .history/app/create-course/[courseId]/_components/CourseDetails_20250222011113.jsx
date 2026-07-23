import React from "react";
import { GiSkills } from "react-icons/gi";

function CourseDetails({ course }) {
  return (
    <div className="border p-6 rounded-xl shadow-sm mt-3">
      <div className="gird grid-cols-2 md:grid-cols-3">
        <div className="flex gap-2">
          <GiSkills className="text-4xl text-primary" />
          <div>
            <h2 className="text-xs text-gray-500">Skill Level</h2>
            <h2 className="font-medium text-lg">{course?.level}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
