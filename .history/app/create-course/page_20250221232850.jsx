"use client";
import React, { useEffect, useState, useContext } from "react";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "@/app/_context/UserInputContext";
import { GenerateCourseLayout_AI } from "@/configs/AiModel";
import LoadingDialog from "./_components/LoadingDialog";
import uuid4 from "uuid4";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";

function CreateCourse() {
  const StepperOptions = [
    {
      id: 1,
      name: "Category",
      icon: <HiMiniSquares2X2 />,
    },
    {
      id: 2,
      name: "Topic & Desc",
      icon: <HiOutlineLightBulb />,
    },
    {
      id: 3,
      name: "Options",
      icon: <HiClipboardDocumentCheck />,
    },
  ];

  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(userCourseInput);
  }, [userCourseInput]);

  const { user } = useUser();

  const router = useRouter();

  const checkStatus = () => {
    if (!userCourseInput) return true;
    if (activeIndex === 0) {
      return (
        !userCourseInput.category || userCourseInput.category.trim() === ""
      );
    }

    if (activeIndex === 1) {
      return !userCourseInput.topic || userCourseInput.topic.trim() === "";
    }

    if (activeIndex === 2) {
      // Ensure all fields under activeIndex === 2 are filled
      return (
        !userCourseInput.level ||
        !userCourseInput.duration ||
        !userCourseInput.displayVideo ||
        !userCourseInput.noOfChapters ||
        userCourseInput.level === undefined ||
        userCourseInput.duration === undefined ||
        userCourseInput.displayVideo === undefined ||
        userCourseInput.noOfChapters === undefined
      );
    }

    return false; // If no condition is met, return false (allow action)
  };

  const GenerateCourseLayout = async () => {
    setLoading(true);
    const BASIC_PROMPT =
      "Generate a Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration. ";

    const USER_INPUT_PROMPT =
      "Category: " +
      userCourseInput?.category +
      ", Topic: " +
      userCourseInput?.topic +
      ", Level: " +
      userCourseInput?.level +
      ", Duration: " +
      userCourseInput?.duration +
      ", NoOfChapters: " +
      userCourseInput?.noOfChapters +
      ", in JSON format.";

    const FINAL_PROMPT = BASIC_PROMPT + " " + USER_INPUT_PROMPT;

    console.log("Final Prompt:", FINAL_PROMPT);

    const result = await GenerateCourseLayout_AI.sendMessage(FINAL_PROMPT);

    console.log(result.response?.text());

    console.log(JSON.parse(result.response?.text()));

    setLoading(false);

    SaveCourseLayoutInDb(JSON.parse(result.response?.text()));
  };

  const SaveCourseLayoutInDb = async (CourseLayout) => {
    var id = uuid4(); //Course Id
    setLoading(true);

    const userName = user?.fullName || user?.id || "Anonymous User";

    const result = await db.insert(CourseList).values({
      courseId: id,
      name: userCourseInput?.topic,
      level: userCourseInput?.level,
      category: userCourseInput?.category,
      courseOutput: CourseLayout,
      createdBy: user?.primaryEmailAddress?.emailAddress, // Email is still being used as is
      userName: userName,
      userProfileImage: user?.imageUrl,
    });

    console.log("Finish");

    setLoading(false);
    router.replace("/create-course/" + id);
  };

  return (
    <div>
      {/* Stepper */}
      <div className="flex flex-col justify-center items-center mt-10">
        <h2 className="text-3xl text-primary font-medium ">Create Course </h2>
        <div className="flex mt-10">
          {StepperOptions.map((item, index) => (
            <div className="flex items-center">
              <div className="flex flex-col items-center w-[50px] md:w-[100px]">
                <div
                  className={`p-3 rounded-full text-white transition-all duration-300 ${
                    activeIndex >= index ? "bg-black" : "bg-gray-200"
                  }`}
                >
                  {item.icon}
                </div>
                <h2 className="hidden md:block md:text-sm">{item.name}</h2>
              </div>
              {index !== StepperOptions.length - 1 && (
                <div
                  className={`h-1 w-[50px] md:w-[100px] rounded-full lg:w-[170px] transition-all duration-300 ${
                    activeIndex > index ? "bg-black" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="px-10 md:px-20 lg:px-44 mt-10">
        {/* Component */}
        {activeIndex == 0 ? (
          <SelectCategory />
        ) : activeIndex == 1 ? (
          <TopicDescription />
        ) : (
          <SelectOption />
        )}
        {/* Next Previous Button */}
        <div className="flex justify-between mt-10">
          <Button
            disabled={activeIndex == 0}
            variant="outline"
            onClick={() => setActiveIndex(activeIndex - 1)}
          >
            Previous
          </Button>
          {activeIndex < 2 && (
            <Button
              disabled={checkStatus()}
              onClick={() => setActiveIndex(activeIndex + 1)}
            >
              Next
            </Button>
          )}
          {activeIndex == 2 && (
            <Button
              disabled={checkStatus()}
              onClick={() => GenerateCourseLayout()}
            >
              Generate Course Layout
            </Button>
          )}
        </div>
      </div>
      <LoadingDialog loading={loading} />
    </div>
  );
}

export default CreateCourse;

// Generate a Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration: Category: 'Programming', Topic: Python, Level: Basic, Duration: 1 hours, NoOfChapters:5, in JSON format
