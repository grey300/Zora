"use client";
import prisma from "@/lib/prisma";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CourseBasicInfo from "./_components/CourseBasicInfo";

function CourseLayout({ params }) {
  //   const { user } = useUser();
  //   const [course, setCourses] = useState([]);

  useEffect(() => {
    console.log(params);
  }, [params]);

  // const GetCourse = async () => {
  //   if (!params?.courseId || !user?.primaryEmailAddress?.emailAddress) {
  //     console.error("Missing required parameters");
  //     return;
  //   }
  //   try {
  //     const result = await prisma.courseList.findMany({
  //       where: {
  //         courseId: params.courseId.trim(),
  //         createdBy: user.primaryEmailAddress.emailAddress.trim(),
  //       },
  //     });
  //     console.log(result);
  //     setCourses(result[0]);
  //   } catch (error) {
  //     console.error("Error fetching course:", error);
  //   }
  // };

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">Course Layout</h2>

      {/* Basic Info */}
      {/* <CourseBasicInfo course={course} /> */}
      {/* Course Layout */}

      {/* List of Lesson */}
    </div>
  );
}

export default CourseLayout;

{
  /*First we need to get the course id from the params and whenever the parsm information is avaible its information should be displayed */
}
// "use client";
// import React, { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import CourseBasicInfo from "./_components/CourseBasicInfo";

// function CourseLayout({ params }) {
//   const { user } = useUser();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (params?.courseId) {
//       GetCourse();
//     }
//   }, [params]);

//   const GetCourse = async () => {
//     try {
//       setLoading(true);

//       // Fetch the course data from the API route
//       const response = await fetch(`/api/course/${params.courseId}`);
//       const data = await response.json();

//       if (!data.success) {
//         throw new Error(data.error);
//       }

//       setCourse(data.course);
//     } catch (error) {
//       console.error("Error fetching course:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!course) {
//     return <div>Course not found.</div>;
//   }

//   return (
//     <div className="mt-10 px-7 md:px-20 lg:px-44">
//       <h2 className="font-bold text-center text-2xl">Course Layout</h2>

//       {/* Basic Info */}
//       <CourseBasicInfo course={course} />

//       {/* Course Layout */}

//       {/* List of Lesson */}
//     </div>
//   );
// }

// export default CourseLayout;
