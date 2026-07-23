"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { Globe, Lock, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditCourseBasicInfo from "./EditCourseBasicInfo";
import Link from "next/link";
import { courseBannerUrl } from "@/lib/banner";

function CourseBasicInfo({ course, refreshData, edit = true }) {
  const { data: session } = useSession();
  const isOwner = !!session?.user?.email && session.user.email === course?.createdBy;
  const [imageUrl, setImageUrl] = useState(course?.courseBanner || null);
  const [isBusy, setIsBusy] = useState(false);
  const [publish, setPublish] = useState(!!course?.publish);
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (course?.courseBanner) setImageUrl(course.courseBanner);
    setPublish(!!course?.publish);
  }, [course]);

  const saveBanner = async (url) => {
    const res = await fetch(`/api/courses/${course?.courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseBanner: url }),
    });
    if (!res.ok) throw new Error("Failed to save banner");
    setImageUrl(url);
  };

  // Generate a fresh AI banner (Pollinations, keyless) and save it.
  const regenerateBanner = async () => {
    if (!course?.courseId) return;
    setIsBusy(true);
    setNotice("");
    try {
      await saveBanner(
        courseBannerUrl({
          topic: course?.name,
          courseName: course?.courseOutput?.CourseName,
          category: course?.category,
        })
      );
    } catch (error) {
      setNotice(error.message);
    } finally {
      setIsBusy(false);
    }
  };

  // Upload the user's own banner image (stored in Cloudinary).
  const onFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !course?.courseId) return;
    setIsBusy(true);
    setNotice("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", "banner");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      await saveBanner(data.url);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setIsBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const togglePublish = async () => {
    if (!course?.courseId) return;
    const next = !publish;
    setPublish(next); // optimistic
    try {
      const res = await fetch(`/api/courses/${course.courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: next }),
      });
      if (!res.ok) throw new Error();
      setNotice(
        next
          ? "Course published — it now appears in Explore."
          : "Course unpublished — removed from Explore."
      );
    } catch {
      setPublish(!next);
      setNotice("Could not update publish status.");
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-gray-200 p-4 dark:border-gray-800 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Text Content */}
        <div className="flex h-full flex-col justify-between space-y-4">
          <div>
            <h2 className="text-xl font-bold md:text-2xl">
              {course?.courseOutput?.CourseName}
              {edit && (
                <EditCourseBasicInfo
                  course={course}
                  refreshData={() => refreshData(true)}
                />
              )}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 md:text-base">
              {course?.courseOutput?.Description}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-indigo-500 dark:text-indigo-400">
              <BiSolidCategoryAlt />
              {course?.category}
            </p>

            {/* Publish toggle — visible to the owner in every view */}
            {(edit || isOwner) && course?.courseId && (
              <button
                onClick={togglePublish}
                className={`mt-4 flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  publish
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500"
                    : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-700"
                }`}
              >
                {publish ? <Globe size={15} /> : <Lock size={15} />}
                {publish ? "Published — visible in Explore" : "Private — click to publish"}
              </button>
            )}
            {notice && (
              <p className="mt-2 text-xs text-indigo-500">{notice}</p>
            )}
          </div>
          {!edit && (
            <Link href={`/course/${course?.courseId}/start`}>
              <Button className="mt-4 w-full md:mt-6">Start Learning</Button>
            </Link>
          )}
        </div>

        {/* Image Section */}
        <div>
          {isBusy ? (
            <div className="flex h-[200px] w-full items-center justify-center md:h-[300px]">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-t-primary"></div>
            </div>
          ) : (
            <Image
              src={imageUrl || "/placeholder.png"}
              width={600}
              height={400}
              className="h-[200px] w-full rounded-xl object-cover md:h-[300px]"
              alt="Course banner"
              unoptimized
            />
          )}
          {edit && (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={regenerateBanner}
                disabled={isBusy}
                className="flex-1"
              >
                <Sparkles size={15} className="mr-2" />
                AI Banner
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="flex-1"
              >
                <Upload size={15} className="mr-2" />
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileSelected}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseBasicInfo;
