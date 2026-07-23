import React from "react";
import { LuClock4 } from "react-icons/lu";
import { MdOutlineCheckCircle } from "react-icons/md";
import EditChapters from "./EditChapters";

function ChapterList({ course, refreshData, edit = true, allowRegenerate = false }) {
  return (
    <div className="mt-3 px-4 sm:px-6 lg:px-0">
      <h2 className="font-medium text-xl sm:text-2xl">Chapters</h2>
      <div className="mt-2 space-y-3">
        {course?.courseOutput?.Chapters.map((chapter, index) => (
          <div
            key={index}
            className="border p-4 sm:p-5 rounded-lg mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex gap-4 sm:gap-6 items-start sm:items-center">
              <h2 className="bg-primary h-8 w-8 sm:h-10 sm:w-10 flex-none text-white rounded-full text-center p-1.5 sm:p-2 dark:bg-[#1A1F26] dark:text-[#6D7588] text-sm sm:text-base">
                {index + 1}
              </h2>
              <div>
                <h2 className="font-medium text-base sm:text-lg">
                  {chapter?.ChapterName}
                  {edit && (
                    <EditChapters
                      course={course}
                      index={index}
                      refreshData={() => refreshData(true)}
                      allowRegenerate={allowRegenerate}
                    />
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">{chapter?.About}</p>
                <p className="flex gap-1 sm:gap-2 text-primary items-center dark:text-[#6D7588] text-xs sm:text-sm mt-1 sm:mt-2">
                  <LuClock4 className="text-sm sm:text-base" />
                  {chapter?.Duration}
                </p>
              </div>
            </div>
            <MdOutlineCheckCircle className="text-2xl sm:text-3xl text-gray-400 flex-none mt-3 sm:mt-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
