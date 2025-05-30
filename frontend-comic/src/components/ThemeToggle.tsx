"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-800/30 border border-green-200 dark:border-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
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
