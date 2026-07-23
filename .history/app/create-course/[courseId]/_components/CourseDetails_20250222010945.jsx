import React from "react";
import { GiSkills } from "react-icons/gi";

function CourseDetails({ course }) {
  return (
    <div className="border p-6 rounded-xl shadow-sm mt-3">
      <div className="gird grid-cols-2 md:grid-cols-3">
        <div>
          <GiSkills />
          <div>
            <h2>Skill Level</h2>
            <h2>{course?.level}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
