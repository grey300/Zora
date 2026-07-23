"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CourseCard from "./CourseCard";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

function UserCourseList() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoaded = status !== "loading";
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user?.email) {
      getUserCourses();
    }
  }, [isLoaded, user?.email]);

  const getUserCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses?scope=mine");
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
    <div className="mt-10 px-4 md:px-6 lg:px-8">
      <h2 className="font-bold text-xl mb-4">My AI Courses</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={index}
              className="w-full mt-5 bg-slate-200 dark:bg-gray-800 animate-pulse rounded-lg h-[200px]"
            ></div>
          ))}
        </div>
      ) : courseList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {courseList.map((course, index) => (
            <CourseCard
              course={course}
              key={index}
              refreshData={() => getUserCourses()}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="You don't have any courses yet"
          description="Create your first AI-generated course to get started."
          action={
            <Link href="/create-course">
              <Button>+ Create Course</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}

export default UserCourseList;
