"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function CourseLayout() {
  const { id } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/courses/${id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setCourse(data.course); // Set the course data from the API
          } else {
            console.error("Failed to fetch course:", data.error);
          }
        })
        .catch((error) => console.error("Error fetching course:", error));
    }
  }, [id]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">{course.name}</h2>
      {/* Render course details here */}
      <p>{course.description}</p>
      {/* Add more course details as needed */}
    </div>
  );
}

export default CourseLayout;
