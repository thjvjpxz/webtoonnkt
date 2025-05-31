"use client";

import Image from "next/image";
import { FiBell } from "react-icons/fi";
import { TopbarProps } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Topbar({ title, isSidebarOpen }: TopbarProps) {
  return (
    <header className="bg-card shadow-soft border-b border-border backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-foreground">
            {title}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Toggle Change Theme */}
          <ThemeToggle />
          {/* Notification Button */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-auto rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
            aria-label="Thông báo"
          >
            <FiBell size={20} />
          </Button>

          {/* User Profile */}
          <div className="flex items-center">
            <div className="relative">
              <Image
                src="https://placehold.co/100x100/05df72/fff?text=Admin"
                alt="Admin"
                width={36}
                height={36}
                className="rounded-full border-2 border-primary shadow-soft"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-card"></div>
            </div>

            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-foreground">
                  Admin
                </p>
                <p className="text-xs text-muted-foreground">
                  admin@comicweb.vn
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
