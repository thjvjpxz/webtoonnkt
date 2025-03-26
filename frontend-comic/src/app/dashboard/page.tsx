"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsOverview from "@/components/dashboard/StatsOverview";
import ChartSection from "@/components/dashboard/ChartSection";
import RecentComicsTable from "@/components/dashboard/RecentComicsTable";
import { ComicData } from "@/types/dashboard";

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
            <StatsOverview />

            {/* Charts and Tables */}
            <ChartSection />

            {/* Recent Comics */}
            <RecentComicsTable comics={recentComics} />
        </DashboardLayout>
    );
}