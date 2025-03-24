export type ComicData = {
    id: number;
    title: string;
    author: string;
    views: number;
    status: "published" | "draft" | "review";
    lastUpdated: string;
    coverImage: string;
};

export type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: string;
    isPositive?: boolean;
}; 