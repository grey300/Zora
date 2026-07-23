import CategoryList from "@/app/_shared/CategoryList";
import React, { useContext } from "react";
import { Palette, Briefcase, FlaskConical, Code2, BookOpen } from "lucide-react";
import { UserInputContext } from "@/app/_context/UserInputContext";

const ICONS = { Palette, Briefcase, FlaskConical, Code2 };

function SelectCategory() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

  const handleCategoryChange = (category) => {
    setUserCourseInput((prev) => ({
      ...prev,
      category: category,
    }));
  };

  return (
    <div suppressHydrationWarning>
      <h2 className="mb-5 text-lg font-medium">Select a category</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {CategoryList.map((item) => {
          const Icon = ICONS[item.icon] || BookOpen;
          const selected = userCourseInput?.category === item.name;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleCategoryChange(item.name)}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all ${
                selected
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50"
              }`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  selected
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                <Icon size={24} />
              </span>
              <span
                className={`text-sm font-medium ${
                  selected ? "text-indigo-600 dark:text-indigo-300" : ""
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SelectCategory;
