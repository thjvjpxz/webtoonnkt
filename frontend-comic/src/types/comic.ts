import { CategoryResponse } from "./category";

export interface ComicCreateUpdate {
  name: string;
  slug: string;
  description: string;
  author: string;
  status: string;
  originName: string;
  categories: string[];
  thumbUrl?: string;
}

// Định nghĩa kiểu dữ liệu cho truyện
export interface ComicResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  author: string;
  thumbUrl: string;
  status: string;
  originName: string;
  viewsCount: number;
  rating: number;
  followersCount: number;
  categories: CategoryResponse[];
  createdAt: string;
  updatedAt: string;
}