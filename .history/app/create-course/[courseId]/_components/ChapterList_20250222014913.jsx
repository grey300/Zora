import React from "react";
import { LuClock4 } from "react-icons/lu";
import { MdOutlineCheckCircle } from "react-icons/md";

function ChapterList({ course }) {
  return (
    <div className="mt-3">
      <h2 className="font-medium text-xl">Chapters</h2>
      <div className="mt-2">
        {course?.courseOutput?.Chapters.map((chapter, index) => (
          <div className="border p-5 rounded-lg mb-2 flex items-center justify-between">
            <div key={index} className="flex gap-6 items-center">
              <h2 className="bg-primary h-10 w-10 flex-none text-white rounded-full text-center p-2">
                {index + 1}
              </h2>
              <div>
                <h2 className="font-medium text-lg">{chapter?.ChapterName}</h2>
                <p className="text-sm text-gray-500">{chapter?.About}</p>
                <p className="flex gap-2 text-primary items-center">
                  <LuClock4 />
                  {chapter?.Duration}
                </p>
              </div>
            </div>
            <MdOutlineCheckCircle className="text-4xl text-gray-300 flex-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;
