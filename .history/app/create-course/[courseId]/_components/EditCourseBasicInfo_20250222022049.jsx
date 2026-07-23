import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";

function EditCourseBasicInfo({ course }) {
  const [CourseName, setName] = useState();
  const [Description, setDescription] = useState();
  const [isClient, setIsClient] = useState(false); // To handle client-side only rendering

  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted on the client
  }, []);

  useEffect(() => {
    if (course) {
      setName(course.courseOutput.CourseName);
      setDescription(course.courseOutput.Description);
    }
  }, [course]);

  const onUpdateHandler = async () => {
    course.courseOutput.CourseName = CourseName;
    course.courseOutput.Description = Description;

    const result = await db
      .update(CourseList)
      .set({
        courseOutput: course?.courseOutput,
      })
      .returning({ id: CourseList.id });
    console.log(result);
  };

  if (!isClient) {
    return null; // Don't render Dialog until client-side is ready
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
            <div className="mt-3">
              <label>Course Title</label>
              <Input
                value={CourseName} // Use value instead of defaultValue to ensure controlled input
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <Textarea
                className="h-40"
                value={Description} // Use value instead of defaultValue to ensure controlled input
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
