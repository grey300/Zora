import React from "react";
import AddCourse from "./_components/AddCourse";
import UserCourseList from "./_components/UserCourseList";
import ChatBot from "./Compnents/ChatBot";
function Dashboard() {
  return (
    <div>
      <AddCourse />

      {/* Display list of Course */}
      <UserCourseList />
      <ChatBot />
    </div>
  );
}

export default Dashboard;
