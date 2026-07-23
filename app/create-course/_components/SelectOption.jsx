import React, { useContext, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  RiBarChartBoxLine,
  RiTimeLine,
  RiVideoLine,
  RiBookOpenLine,
} from "react-icons/ri"; // Import icons
import { UserInputContext } from "@/app/_context/UserInputContext";

function SelectOption() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleInputChange = (fieldName, value) => {
    setUserCourseInput((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="px-10 md:px-20 lg:px-44">
      <div>
        <div className="grid grid-cols-2 gap-8">
          {/* Difficulty Level */}
          <div>
            <label className="text-sm flex items-center gap-2 mb-2">
              <RiBarChartBoxLine className="text-lg text-primary dark:text-white" />
              Difficulty Level
            </label>
            <Select
              onValueChange={(value) => handleInputChange("level", value)}
              defaultValue={userCourseInput?.level || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course Duration */}
          <div>
            <label className="text-sm flex items-center gap-2 mb-2">
              <RiTimeLine className="text-lg text-primary dark:text-white" />
              Course Duration
            </label>
            <Select
              onValueChange={(value) => handleInputChange("duration", value)}
              defaultValue={userCourseInput?.duration || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 Hour">1 Hour</SelectItem>
                <SelectItem value="2 Hours">2 Hours</SelectItem>
                <SelectItem value="More than 3 Hours">
                  More than 3 Hours
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Video */}
          <div>
            <label className="text-sm flex items-center gap-2 mb-2">
              <RiVideoLine className="text-lg text-primary dark:text-white" />
              Add Video
            </label>
            <Select
              onValueChange={(value) =>
                handleInputChange("displayVideo", value)
              }
              defaultValue={userCourseInput?.displayVideo || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Number of Chapters */}
          <div>
            <label className="text-sm flex items-center gap-2 mb-2">
              <RiBookOpenLine className="text-lg text-primary dark:text-white" />
              Number of Chapters
            </label>
            <Input
              type="number"
              onChange={(event) =>
                handleInputChange("noOfChapters", event.target.value)
              }
              defaultValue={userCourseInput?.noOfChapters || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectOption;
