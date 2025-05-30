"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-green-50 hover:bg-green-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <FaMoon className="w-5 h-5 text-green-700 dark:text-green-400" />
      ) : (
        <FaSun className="w-5 h-5 text-green-600 dark:text-green-300" />
      )}
    </button>
  );
}
