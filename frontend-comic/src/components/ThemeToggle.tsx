"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import Button from "./ui/Button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="primaryOutline"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <FaMoon className="w-5 h-5" />
      ) : (
        <FaSun className="w-5 h-5" />
      )}
    </Button>
  );
}
