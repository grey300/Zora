import React, { useContext } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RiFileTextLine, RiArticleLine, RiUserLine } from "react-icons/ri";
import { UserInputContext } from "@/app/_context/UserInputContext";

function TopicDescription() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleInputChange = (fieldName, value) => {
    setUserCourseInput((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Topic */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
          <RiFileTextLine className="text-lg text-indigo-500" />
          Course topic
        </label>
        <Input
          placeholder="e.g. Quantum Physics, React for beginners, Bhutanese history"
          defaultValue={userCourseInput?.topic || ""}
          onChange={(e) => handleInputChange("topic", e.target.value)}
        />
      </div>

      {/* Description / what to include */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
          <RiArticleLine className="text-lg text-indigo-500" />
          What should the course cover?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          className="h-24 resize-none"
          placeholder='e.g. "Focus on practical examples", "Include the history section", "Prepare me for an exam"'
          defaultValue={userCourseInput?.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </div>

      {/* Audience */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
          <RiUserLine className="text-lg text-indigo-500" />
          Who is this course for?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Input
          placeholder='e.g. "High school students", "Complete beginners", "Working developers"'
          defaultValue={userCourseInput?.audience || ""}
          onChange={(e) => handleInputChange("audience", e.target.value)}
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          The AI adapts explanations, examples and tone to your audience.
        </p>
      </div>
    </div>
  );
}

export default TopicDescription;
