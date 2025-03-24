"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type DashboardLayoutProps = {
    children: ReactNode;
    title: string;
};

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-green-50/50 dark:bg-gray-900">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar title={title} isSidebarOpen={isSidebarOpen} />

                <main className="flex-1 overflow-y-auto bg-green-50/50 p-6 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
} 