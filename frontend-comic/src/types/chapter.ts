import { LevelResponse } from "./level";

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  status: ChapterStatus;
  price?: number;
  comicName?: string;
  detailChapters: DetailChapter[];
  domainCdn: string;
  chapterPath: string;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
  hasPurchased: boolean;
  hasAudio: boolean;
  isRead: boolean;
  chapterSummaries?: ChapterSummary[];
  publisherName?: string;
  publisherLevel?: LevelResponse;
}

export interface ChapterSummary {
  id: string;
  title: string;
  chapterNumber: number;
}

export interface ChapterWithComicDetail extends Chapter {
  comicId: string;
}

export interface ChapterCreateUpdate {
  id?: string;
  chapterNumber: number;
  title: string;
  comicId: string;
  status: ChapterStatus;
  price?: number;
  detailChapters: DetailChapterCreateUpdate[];
  isFileUploaded: boolean;
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
  FEE = "FEE",
  FREE = "FREE"
}

export interface DetailChapterCreateUpdate {
  imgUrl: string;
  orderNumber: number;
}

export interface DetailChapter {
  id: string;
  imgUrl: string;
  orderNumber: number;
  ttsUrl: string;
  hasBubble: boolean;
}


