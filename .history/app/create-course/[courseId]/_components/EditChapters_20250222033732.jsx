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

function EditChapters({
  course = { courseOutput: { Chapters: [] } },
  index,
  refreshData,
}) {
  // Safeguard: Ensure `course` and `Chapters` are defined
  const Chapters = course?.courseOutput?.Chapters || [];

  // Initialize state with default values
  const [name, setName] = useState(Chapters[index]?.ChapterName || "");
  const [about, setAbout] = useState(Chapters[index]?.About || "");

  // Update state when `course` or `index` changes
  useEffect(() => {
    if (Chapters[index]) {
      setName(Chapters[index].ChapterName || "");
      setAbout(Chapters[index].About || "");
    }
  }, [course, index]);

  // Handle update
  const onUpdateHandler = async () => {
    if (!course || !Chapters[index]) return;

    // Create a new object to avoid direct mutation
    const updatedChapters = [...Chapters];
    updatedChapters[index] = {
      ...updatedChapters[index],
      ChapterName: name,
      About: about,
    };

    const updatedCourse = {
      ...course,
      courseOutput: {
        ...course.courseOutput,
        Chapters: updatedChapters,
      },
    };

    // Update the database
    try {
      const result = await db
        .update(CourseList)
        .set({
          courseOutput: updatedCourse.courseOutput,
        })
        .where(eq(CourseList.id, course.id))
        .returning({ id: CourseList.id });

      console.log("Update successful:", result);
    } catch (error) {
      console.error("Failed to update course:", error);
    }
    refreshData(true);
  };

  // Conditional rendering to avoid runtime errors
  if (!course || !Chapters[index]) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog>
      <DialogTrigger>
        <CiEdit />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
          <DialogDescription>
            <div className="mt-3">
              <label>Chapter Name</label>
              <Input
                defaultValue={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <Textarea
                className="h-40"
                defaultValue={about}
                onChange={(event) => setAbout(event.target.value)}
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

export default EditChapters;
