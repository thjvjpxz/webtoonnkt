import { CategoryResponse } from "./category";
import { ChapterStatus } from "./chapter";

export interface PopulerToday {
  id: string;
  slug: string;
  name: string;
  thumbUrl: string;
  viewCount: number;
  latestChapter: number;
  alreadyRead: number;
}

export interface ComicHome {
  populerCategories: CategoryResponse[];
  populerToday: PopulerToday[];
  populerWeek: PopulerToday[];
  populerMonth: PopulerToday[];
  populerAll: PopulerToday[];
  comicLastUpdate: ComicLastUpdate[];
}

export interface ChapterHome {
  id: string;
  domainCdn: string;
  chapterPath: string;
  status: ChapterStatus;
  price?: number;
  chapterNumber: number
  createdAt: string;
  updatedAt: string;
}

export interface ComicLastUpdate extends PopulerToday {
  chapters: ChapterHome[];
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}