import { CategoryResponse } from "./category";

// Interface cho tạo/cập nhật comic của publisher
export interface PublisherComicRequest {
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

// Interface cho response comic của publisher với thông tin thống kê
export interface PublisherComicResponse {
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
  publisherUserName: string;
  categories: CategoryResponse[];
  createdAt: string;
  updatedAt: string;
}
