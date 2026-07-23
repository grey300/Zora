import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import EditCourseBasicInfo from "./EditCourseBasicInfo";
import { db } from "@/configs/db"; // Ensure your db is properly imported
import { eq } from "drizzle-orm";
import { CourseList } from "@/configs/schema"; // Ensure correct path to schema

function CourseBasicInfo({ course, refreshData }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Set course image when the component loads
  useEffect(() => {
    if (course?.courseBanner) {
      setImageUrl(course.courseBanner);
    }
  }, [course]);

  const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Set temporary preview
    setSelectedFile(URL.createObjectURL(file));

    // Prepare form data for Cloudinary upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset"); // Replace with your actual upload preset

    try {
      // Upload image to Cloudinary
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

      // Save the URL in the database
      await db
        .update(CourseList)
        .set({ courseBanner: data.secure_url })
        .where(eq(CourseList.id, course?.id));

      console.log("✅ Course banner updated in the database");
      setImageUrl(data.secure_url); // Store the URL for display
      refreshData(); // Refresh course data
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
              src={selectedFile ? selectedFile : imageUrl || "/placeholder.png"}
              width={300}
              height={300}
              className="w-full rounded-xl h-[300px] object-cover"
              alt="Course banner image"
            />
          </label>
          <input
            type="file"
            id="upload-image"
            className="opacity-0 absolute"
            onChange={onFileSelected}
          />
        </div>
      </div>
    </div>
  );
}

export default CourseBasicInfo;
