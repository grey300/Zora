"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CourseCard from "./CourseCard";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Layers3 } from "lucide-react";
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
    <section className="mt-12 page-enter [animation-delay:120ms]">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Your library</span>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Continue learning</h2>
        </div>
        {courseList.length > 0 && <Link href="/dashboard/explore" className="hidden items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-emerald-600 sm:flex">Explore courses <ArrowRight size={16}/></Link>}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={index}
              className="h-[320px] w-full animate-pulse rounded-[1.75rem] bg-slate-200 dark:bg-white/[0.06]"
            ></div>
          ))}
        </div>
      ) : courseList.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
    </section>
  );
}

export default UserCourseList;
