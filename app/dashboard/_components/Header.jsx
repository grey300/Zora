"use client";
import React, { useEffect, useState } from "react";
import { UserMenu } from "@/components/auth/UserMenu";
import { Moon, Sun, Menu } from "lucide-react";

const Header = ({ setShowMobileSidebar }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/[0.06] bg-background/80 px-4 backdrop-blur-xl sm:px-6 dark:border-white/[0.06]">
      {/* Mobile menu button */}
      <button
        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
        onClick={() => setShowMobileSidebar?.(true)}
      >
        <Menu size={22} />
      </button>

      {/* Right: theme toggle + user */}
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          title="Toggle theme"
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
