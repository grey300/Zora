import React from "react";
import { CiClock2 } from "react-icons/ci";

export default function ChapterListCard({ chapter, index }) {
  return (
    <div className="grid grid-cols-5 p-3 items-center border-b">
      <div className="flex justify-center items-center">
        <h2 className="w-8 h-8 p-1 bg-primary text-secondary rounded-full flex justify-center items-center text-center">
          {index + 1}
        </h2>
      </div>
      <div className="col-span-4">
        <h2 className="text-sm">{chapter?.ChapterName}</h2>
        <h2 className="flex items-center gap-2 text-sm text-primary">
          <CiClock2 />
          {chapter?.Duration}
        </h2>
      </div>
    </div>
  );
}
