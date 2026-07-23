import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CiEdit } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";

function EditCourseBasicInfo({ course = { courseOutput: {} } }) {
  // Initialize state with default values
  const [CourseName, setName] = useState(
    course?.courseOutput?.CourseName || ""
  );
  const [Description, setDescription] = useState(
    course?.courseOutput?.Description || ""
  );

  // Update state when `course` changes
  useEffect(() => {
    setName(course?.courseOutput?.CourseName || "");
    setDescription(course?.courseOutput?.Description || "");
  }, [course]);

  // Handle update
  const onUpdateHandler = async () => {
    // Create a new object to avoid direct mutation
    const updatedCourse = {
      ...course,
      courseOutput: {
        ...course.courseOutput,
        CourseName,
        Description,
      },
    };

    // Update the database
    const result = await db
      .update(CourseList)
      .set({
        courseOutput: updatedCourse.courseOutput,
      })
      .where(eq(CourseList.id, course.id))
      .returning({ id: CourseList.id });

    console.log(result);
  };

  // Conditional rendering to avoid hydration mismatches
  if (!course || !course.courseOutput) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <CiEdit />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course Title and Description</DialogTitle>
          <DialogDescription>
            <div suppressHydrationWarning className="mt-3">
              <label>Course Title</label>
              <Input
                defaultValue={CourseName}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <Textarea
                className="h-40"
                defaultValue={Description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button onClick={onUpdateHandler}>Update</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditCourseBasicInfo;
