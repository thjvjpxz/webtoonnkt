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
  chapterSummaries?: ChapterSummary[];
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
  newImage: boolean;
  hasRemove: boolean;
}

export interface DetailChapter {
  id: string;
  imgUrl: string;
  orderNumber: number;
}


