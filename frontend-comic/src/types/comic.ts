import { CategoryResponse } from "./category";
import { Chapter } from "./chapter";

export interface ComicCreateUpdate {
  name: string;
  slug: string;
  description: string;
  author: string;
  status: string;
  originName: string;
  categories: string[];
  thumbUrl?: string;

  isSlugChanged: boolean;
  isThumbUrlChanged: boolean;
  isCategoriesChanged: boolean;
  shouldRemoveThumbUrl: boolean;
}

// Định nghĩa kiểu dữ liệu cho truyện
export interface ComicResponse {
  id: string;
  name: string;
  slug: string;
  originName: string;
  thumbUrl: string;
  author: string;
  status: string;
  followersCount: number;
  viewsCount: number;
  description: string;
  lastChapterId: string;
  categories: CategoryResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ComicDetailResponse extends ComicResponse {
  chapters: Chapter[];
}

