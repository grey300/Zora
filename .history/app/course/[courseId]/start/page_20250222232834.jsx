import { CourseList } from "@/configs/schema";
import React from "react";
import {db} from "@/configs/db"
import React from 'react'
function CourseStart() {
    const GetCourse=()=>{
        const result = await db.select().from(CourseList
            .
        )
    }
  return <div>CourseStart</div>;
}

export default CourseStart;
