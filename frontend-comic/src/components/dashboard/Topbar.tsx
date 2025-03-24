"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiSearch, FiBell, FiSun, FiMoon } from "react-icons/fi";

type TopbarProps = {
    title: string;
    isSidebarOpen: boolean;
};

export default function Topbar({ title, isSidebarOpen }: TopbarProps) {
    const [mounted, setMounted] = useState(false);

    // Đảm bảo component đã được mount trước khi render nội dung phụ thuộc vào client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Render nội dung cơ bản trong quá trình SSR
    if (!mounted) {
        return (
            <header className="bg-white shadow-sm z-10 border-b border-green-100">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Placeholder cho các nút */}
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-sm z-10 border-b border-green-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        />
                        <FiSearch className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
                    </div>
                    <button
                        className="p-2 rounded-full bg-green-50 hover:bg-green-100 text-green-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-green-400"
                        aria-label="Thông báo"
                    >
                        <FiBell size={20} />
                    </button>
                    <div className="flex items-center">
                        <Image
                            src="https://placehold.co/100x100/4ade80/fff?text=Admin"
                            alt="Admin"
                            width={36}
                            height={36}
                            className="rounded-full border-2 border-green-400 dark:border-green-500"
                        />
                        {isSidebarOpen && (
                            <div className="ml-2">
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Admin</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">admin@comicweb.vn</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
} 