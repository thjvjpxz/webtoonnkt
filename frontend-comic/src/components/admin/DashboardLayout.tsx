"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ReactNode } from "react";
import { ProtectedRoute } from "../auth/ProtectedRoute";

export interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  isPublisher?: boolean;
}

export default function DashboardLayout({
  children,
  title,
  isPublisher = false,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isPublisher) {
    return (
      <ProtectedRoute roles={['PUBLISHER']} redirectTo="/">
        <div className="flex h-screen bg-background">
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isPublisher={isPublisher} />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar title={title} />

            <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {children}
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute roles={['ADMIN']} redirectTo="/">
      <div className="flex h-screen bg-background">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isPublisher={isPublisher} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar title={title} />

          <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
