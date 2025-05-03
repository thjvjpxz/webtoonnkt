import { CategoryResponse } from "./category";
export type DeleteComicModalProps = {
  comicTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

export type ViewComicModalProps = {
  comic: ComicResponse;
  onClose: () => void;
};

export type ComicModalProps = {
  comic: ComicResponse | null;
  categories: CategoryResponse[];
  onClose: () => void;
  onSave: (comic: ComicCreateUpdate, file?: File) => Promise<void>;
};

// Định nghĩa kiểu dữ liệu cho truyện
export type ComicResponse = {
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
};

// Định nghĩa kiểu dữ liệu cho việc tạo/cập nhật truyện
export type ComicCreateUpdate = {
  name: string;
  slug: string;
  description: string;
  author: string;
  thumbUrl: string;
  status: string;
  originName: string;
  categories: string[];
};