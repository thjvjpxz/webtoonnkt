"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Tránh hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Không render gì cho đến khi component mounted
  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`
        relative w-8 h-8 rounded-lg p-0 transition-all duration-200 ease-in-out
        hover:scale-105 hover:bg-accent/80
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        ${isDark
          ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700'
          : 'bg-amber-50 hover:bg-amber-100 border border-amber-200'
        }
      `}
      aria-label={`Chuyển sang chế độ ${isDark ? "sáng" : "tối"}`}
      title={`Chuyển sang chế độ ${isDark ? "sáng" : "tối"}`}
    >
      <div className={`
        transition-all duration-300 ease-in-out
        ${isDark ? 'rotate-0 scale-100' : 'rotate-180 scale-100'}
      `}>
        {isDark ? (
          <FaMoon className="w-4 h-4 text-slate-300" />
        ) : (
          <FaSun className="w-4 h-4 text-amber-600" />
        )}
      </div>

      {/* Subtle glow effect */}
      <div className={`
        absolute inset-0 rounded-lg transition-opacity duration-200
        ${isDark
          ? 'bg-blue-500/5 opacity-0 hover:opacity-100'
          : 'bg-amber-400/10 opacity-0 hover:opacity-100'
        }
      `} />
    </Button>
  );
}
