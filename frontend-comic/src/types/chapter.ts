import { ComicResponse } from "./comic";

export interface Chapter {
  id: string;
  chapterNumber: string;
  title: string;
  viewCount: number;
  comicId: string;
  comicName: string;
  detailChapters: DetailChapter[];
  domainCdn: string;
  chapterPath: string;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterCreateUpdate {
  id?: string;
  chapterNumber: string;
  title: string;
  comicId: string;
}

export interface ChapterImage {
  id: string;
  url: string;
  page: number;
  chapterId: string;
}

export interface ChapterListResponse {
  id: string;
  chapterNumber: string;
  title: string;
  viewCount: number;
  comicId: string;
  comicName: string;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
}

export enum ChapterStatus {
  FEE,
  FREE,
  VIP
}

export interface DetailChapterCreateUpdate {
  imgUrl: string;
  orderNumber: number;
  newImage: boolean;
  hasRemove: boolean;
}

export interface DetailChapter {
  id: string;
  imgUrl: string;
  orderNumber: number;
}


