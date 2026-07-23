import React from "react";
import AddCourse from "./_components/AddCourse";
import { CourseList } from "./_components/CourseList";
function Dashboard() {
  return (
    <div>
      <AddCourse />

      {/* Display list of Course */}
      <CourseList />
    </div>
  );
}

export default Dashboard;
