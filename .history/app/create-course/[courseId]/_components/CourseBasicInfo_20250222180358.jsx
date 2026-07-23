"use client"; // Ensure it's a Client Component
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import EditCourseBasicInfo from "./EditCourseBasicInfo";
import { db } from "@/configs/db"; // Ensure your db is properly imported
import { eq } from "drizzle-orm";
import { CourseList } from "@/configs/schema"; // Ensure correct path to schema

function CourseBasicInfo({ course, refreshData }) {
  const { courseId } = useParams(); // ✅ Correct way to get the courseId

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(course?.courseBanner || null);

  useEffect(() => {
    if (course?.courseBanner) {
      setImageUrl(course.courseBanner);
    }
  }, [course]);

  const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file); // Store the file for preview

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset"); // Replace with your actual Cloudinary upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dzynhhauq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);

      console.log("✅ Upload Successful:", data.secure_url);

      // Update the database with the new image URL
      await db
        .update(CourseList)
        .set({ courseBanner: data.secure_url })
        .where(eq(CourseList.id, courseId)); // ✅ Use correct courseId

      console.log("✅ Course banner updated in the database");
      setImageUrl(data.secure_url); // Update UI with the new image
      refreshData(); // Refresh data after update
    } catch (error) {
      console.error("❌ Error uploading file:", error.message);
    }
  };

  return (
    <div className="p-10 border rounded-xl shadow-sm mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="font-bold text-2xl">
              {course?.courseOutput?.CourseName}
              <EditCourseBasicInfo
                course={course}
                refreshData={() => refreshData(true)}
              />
            </h2>
            <h2 className="text-sm text-gray-400 mt-3">
              {course?.courseOutput?.Description}
            </h2>
            <h2 className="font-medium mt-2 flex gap-2 items-center text-primary">
              <BiSolidCategoryAlt />
              {course?.category}
            </h2>
          </div>
          <Button className="mt-5 w-full">Start</Button>
        </div>
        <div>
          <label htmlFor="upload-image" className="cursor-pointer">
            <Image
              src={imageUrl ? imageUrl : "/placeholder.png"}
              width={300}
              height={300}
              className="w-full rounded-xl h-[300px] object-cover"
              alt="Course image preview"
            />
          </label>
          <input
            type="file"
            id="upload-image"
            className="hidden"
            onChange={onFileSelected}
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
}

export default CourseBasicInfo;
