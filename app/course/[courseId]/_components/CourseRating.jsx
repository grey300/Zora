"use client";

import React from "react";
import { useSession } from "next-auth/react";
import RatingStars from "@/components/common/RatingStars";

/**
 * Rating block on a course page: shows the community average and lets any
 * signed-in user (except the owner) rate a published course.
 */
export default function CourseRating({ course }) {
  const { data: session } = useSession();
  const [data, setData] = React.useState(null);
  const [message, setMessage] = React.useState("");

  const isOwner = session?.user?.email === course?.createdBy;

  const load = React.useCallback(async () => {
    if (!course?.courseId) return;
    try {
      const res = await fetch(`/api/courses/${course.courseId}/ratings`);
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error("Failed to load ratings", e);
    }
  }, [course?.courseId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const rate = async (rating) => {
    setMessage("");
    try {
      const res = await fetch(`/api/courses/${course.courseId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Could not save rating.");
      setMessage("Thanks for rating! ⭐");
      load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (!course?.publish) return null;

  return (
    <div className="mt-5 rounded-2xl border border-gray-200 p-4 dark:border-gray-800 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold">Community rating</h3>
          <div className="mt-1">
            {data ? (
              data.count > 0 ? (
                <RatingStars value={data.average} count={data.count} size={18} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No ratings yet — be the first!
                </p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">Loading…</p>
            )}
          </div>
        </div>

        {!isOwner && (
          <div className="text-right">
            <p className="mb-1 text-xs text-muted-foreground">
              {data?.myRating ? "Your rating (tap to change)" : "Rate this course"}
            </p>
            <RatingStars value={data?.myRating || 0} onChange={rate} size={22} />
          </div>
        )}
      </div>
      {message && <p className="mt-2 text-xs text-green-500">{message}</p>}
    </div>
  );
}
