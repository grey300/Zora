"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "../_components/CourseCard";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import { Compass } from "lucide-react";

function Explore() {
  const [courseList, setCourseList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetAllCourse();
  }, [pageIndex]);

  const GetAllCourse = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses?scope=explore&page=${pageIndex}`);
      const data = await res.json();
      setCourseList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setCourseList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="font-bold text-2xl sm:text-3xl mb-4">Explore More Projects</h2>
      <p className="mb-6 text-sm sm:text-base">
        Explore more projects built with AI by other users
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full bg-slate-200 dark:bg-gray-800 animate-pulse rounded-lg h-[200px]"
            ></div>
          ))}
        </div>
      ) : courseList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {courseList.map((course, index) => (
            <div key={index}>
              <CourseCard course={course} displayUser={true} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title={pageIndex === 0 ? "No courses to explore yet" : "No more courses"}
          description={
            pageIndex === 0
              ? "Once users start creating courses, they'll show up here."
              : "You've reached the end of the list."
          }
        />
      )}

      <div className="flex justify-between items-center mt-5">
        {pageIndex !== 0 && (
          <Button onClick={() => setPageIndex(pageIndex - 1)}>
            Previous Page
          </Button>
        )}
        {courseList.length === 8 && (
          <Button className="ml-auto" onClick={() => setPageIndex(pageIndex + 1)}>
            Next Page
          </Button>
        )}
      </div>
    </div>
  );
}

export default Explore;
