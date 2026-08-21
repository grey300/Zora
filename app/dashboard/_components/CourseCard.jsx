import React from "react";
import Image from "next/image";
import { FaBookOpen } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import DropdownOption from "./DropdownOption";
import Link from "next/link";
import { Globe } from "lucide-react";
import RatingStars from "@/components/common/RatingStars";

function CourseCard({ course, refreshData, displayUser = false }) {
  const handleOnDelete = async () => {
    try {
      const res = await fetch(`/api/courses/${course?.courseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        refreshData();
      } else {
        const data = await res.json().catch(() => ({}));
        console.error("Delete failed:", data.error);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white shadow-[0_2px_6px_rgba(15,23,42,.03)] transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/25 hover:shadow-[0_28px_70px_rgba(5,150,105,.12)] dark:border-white/[0.07] dark:bg-white/[0.035] dark:hover:border-emerald-400/25 dark:hover:shadow-[0_28px_70px_rgba(0,0,0,.3)]">
      <Link href={`/course/${course?.courseId}`}>
        <div className="relative overflow-hidden p-2 pb-0">
          <Image
            src={course?.courseBanner || "/placeholder.png"}
            width={600}
            height={400}
            className="h-[190px] w-full rounded-[1.25rem] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            alt={course?.courseOutput?.CourseName || "Course Banner"}
            unoptimized
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="flex items-start justify-between gap-2 text-base font-semibold text-gray-900 dark:text-white">
          <Link
            href={`/course/${course?.courseId}`}
            className="line-clamp-2 min-h-[2.8rem] text-lg font-bold leading-snug transition hover:text-emerald-600 dark:hover:text-emerald-300"
          >
            {course?.courseOutput?.CourseName}
          </Link>

          {!displayUser && (
            <span className="flex items-center gap-1.5">
              {course?.publish && (
                <span title="Published in Explore">
                  <Globe size={14} className="text-emerald-500" />
                </span>
              )}
              <DropdownOption handleOnDelete={() => handleOnDelete()}>
                <BsThreeDotsVertical />
              </DropdownOption>
            </span>
          )}
        </h2>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {course?.category}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <FaBookOpen />
            {course?.courseOutput?.NoOfChapters} Chapters
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {course?.level}
          </span>
        </div>

        {/* Push the footer to the bottom so all cards align */}
        <div className="mt-auto pt-3">
          {course?.rating && (
            <RatingStars
              value={course.rating.average}
              count={course.rating.count}
              size={14}
            />
          )}
          {displayUser && (
            <div className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
              <Image
                src={course?.userProfileImage || "/placeholder.png"}
                width={26}
                height={26}
                className="h-[26px] w-[26px] rounded-full object-cover"
                alt="User"
                unoptimized
              />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {course?.userName}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
