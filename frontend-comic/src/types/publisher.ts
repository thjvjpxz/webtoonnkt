import { CategoryResponse } from "./category";

// Interface cho tạo/cập nhật comic của publisher
export interface PublisherComicRequest {
  name: string;
  originName?: string;
  author: string;
  description?: string;
  thumbUrl?: string;
  categoryIds: string[];
}

// Interface cho response comic của publisher với thông tin thống kê
export interface PublisherComicResponse {
  id: string;
  name: string;
  slug: string;
  originName?: string;
  thumbUrl?: string;
  author: string;
  status: "ONGOING" | "COMPLETED";
  description?: string;

  // Thống kê
  followersCount: number;
  viewsCount: number;
  chaptersCount: number;
  totalRevenue: number;

  // Metadata
  categories: CategoryResponse[];
  createdAt: string;
  updatedAt: string;

  // Chapter mới nhất
  lastChapterId?: string;
  lastChapterTitle?: string;
  lastChapterNumber?: number;
}

// Interface cho thống kê publisher
export interface PublisherStatsResponse {
  totalComics: number;
  totalChapters: number;
  totalViews: number;
  totalFollowers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  availableBalance: number;
}

// Interface cho yêu cầu rút tiền
export interface WithdrawalRequestDto {
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  reason?: string;
}

// Interface cho response yêu cầu rút tiền
export interface WithdrawalRequest {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  reason?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestDate: string;
  processedDate?: string;
  note?: string;
} 