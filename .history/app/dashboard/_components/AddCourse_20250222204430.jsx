"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AddCourse() {
  const { user } = useUser();

  console.log("User Data:", user); // Debugging

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl">
          Kuzuzangpo,{" "}
          <span className="font-bold">{user?.fullName || "Guest"}</span>
        </h2>
        <p className="text-sm text-gray-500">
          Create new course with AI, share it friends
        </p>
      </div>
      <Link href={"/create-course"}>
        <Button>+ Create Course</Button>
      </Link>
    </div>
  );
}

export default AddCourse;
