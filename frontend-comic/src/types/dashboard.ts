import { ReactNode } from "react";

export interface ComicData {
  id: number;
  title: string;
  author: string;
  views: number;
  status: "published" | "draft" | "review";
  lastUpdated: string;
  coverImage: string;
}

export type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
};

export type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  isPositive?: boolean;
};

export type SidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export type TopbarProps = {
  title: string;
  isSidebarOpen: boolean;
};

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
