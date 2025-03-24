"use client";

import { useState } from "react";
import Image from "next/image";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FiBook, FiEye, FiUser, FiMessageSquare, FiEdit, FiTrash2 } from "react-icons/fi";

// Định nghĩa các loại dữ liệu
type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: string;
    isPositive?: boolean;
};

type ComicData = {
    id: number;
    title: string;
    author: string;
    views: number;
    status: "published" | "draft" | "review";
    lastUpdated: string;
    coverImage: string;
};

// Component Card Thống kê
const StatCard = ({ title, value, icon, change, isPositive }: StatCardProps) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">{title}</h3>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{value}</p>
                    {change && (
                        <p className={`text-xs mt-2 ${isPositive ? 'text-green-600' : 'text-rose-500'}`}>
                            {isPositive ? '↑' : '↓'} {change} so với tháng trước
                        </p>
                    )}
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-green-500 dark:bg-green-900/30 dark:text-green-400">
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Component Bảng Truyện Mới Nhất
const RecentComicsTable = ({ comics }: { comics: ComicData[] }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 border-b border-green-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Truyện mới cập nhật</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-green-50 dark:bg-green-900/30">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Truyện</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Tác giả</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Lượt xem</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Cập nhật</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-green-100 dark:divide-gray-700">
                        {comics.map((comic) => (
                            <tr key={comic.id} className="hover:bg-green-50/50 dark:hover:bg-green-900/10">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                                            <Image
                                                src={comic.coverImage}
                                                alt={comic.title}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-cover"
                                            />
                                        </div>
                                        <div className="font-medium text-gray-800 dark:text-gray-200">{comic.title}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{comic.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{comic.views.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${comic.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' :
                                            comic.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                                                'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400'}`}>
                                        {comic.status === 'published' ? 'Đã xuất bản' :
                                            comic.status === 'draft' ? 'Bản nháp' : 'Đang xét duyệt'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{comic.lastUpdated}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-green-600 hover:text-green-800 mr-3 flex items-center dark:text-green-500 dark:hover:text-green-400">
                                        <FiEdit className="mr-1" size={16} />
                                        Sửa
                                    </button>
                                    <button className="text-rose-500 hover:text-rose-700 flex items-center dark:text-rose-400 dark:hover:text-rose-300">
                                        <FiTrash2 className="mr-1" size={16} />
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Component Dashboard chính
export default function Dashboard() {
    // Dữ liệu mẫu
    const recentComics: ComicData[] = [
        {
            id: 1,
            title: "One Piece",
            author: "Eiichiro Oda",
            views: 1250000,
            status: "published",
            lastUpdated: "Hôm nay, 10:30",
            coverImage: "https://placehold.co/100x150/4ade80/fff?text=OP"
        },
        {
            id: 2,
            title: "Naruto",
            author: "Masashi Kishimoto",
            views: 980000,
            status: "published",
            lastUpdated: "Hôm qua, 15:45",
            coverImage: "https://placehold.co/100x150/4ade80/fff?text=NA"
        },
        {
            id: 3,
            title: "Dragon Ball Super",
            author: "Akira Toriyama",
            views: 870000,
            status: "review",
            lastUpdated: "2 ngày trước",
            coverImage: "https://placehold.co/100x150/4ade80/fff?text=DB"
        },
        {
            id: 4,
            title: "My Hero Academia",
            author: "Kohei Horikoshi",
            views: 650000,
            status: "draft",
            lastUpdated: "3 ngày trước",
            coverImage: "https://placehold.co/100x150/4ade80/fff?text=MHA"
        },
        {
            id: 5,
            title: "Jujutsu Kaisen",
            author: "Gege Akutami",
            views: 720000,
            status: "published",
            lastUpdated: "4 ngày trước",
            coverImage: "https://placehold.co/100x150/4ade80/fff?text=JJK"
        }
    ];

    return (
        <DashboardLayout title="Tổng quan">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Tổng số truyện"
                    value="1,254"
                    icon={<FiBook size={24} />}
                    change="12%"
                    isPositive={true}
                />
                <StatCard
                    title="Lượt xem hôm nay"
                    value="45,678"
                    icon={<FiEye size={24} />}
                    change="8%"
                    isPositive={true}
                />
                <StatCard
                    title="Người dùng mới"
                    value="328"
                    icon={<FiUser size={24} />}
                    change="5%"
                    isPositive={true}
                />
                <StatCard
                    title="Bình luận mới"
                    value="156"
                    icon={<FiMessageSquare size={24} />}
                    change="3%"
                    isPositive={false}
                />
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-green-100 dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Thống kê lượt xem</h2>
                    <div className="h-80 flex items-center justify-center bg-green-50/50 rounded-lg border border-green-100 dark:bg-gray-700/30 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">Biểu đồ thống kê lượt xem sẽ hiển thị ở đây</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100 dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Phân bố thể loại</h2>
                    <div className="h-80 flex items-center justify-center bg-green-50/50 rounded-lg border border-green-100 dark:bg-gray-700/30 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">Biểu đồ phân bố thể loại sẽ hiển thị ở đây</p>
                    </div>
                </div>
            </div>

            {/* Recent Comics */}
            <RecentComicsTable comics={recentComics} />
        </DashboardLayout>
    );
}