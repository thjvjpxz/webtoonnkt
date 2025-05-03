export enum CrawlerStatus {
  STARTED = "STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

export interface CrawlerOptions {
  startPage: number;
  endPage: number;
  saveDrive: boolean;
}

export interface LastCompletedChapter {
  comicName: string;
  chapterNumber: string;
  chapterTitle: string;
  imageCount: number;
}

export interface CrawlerError {
  comicSlug: string;
  error: string;
}

export interface CrawlerProgress {
  status: CrawlerStatus;
  currentPage?: number;
  totalPages?: number;
  totalComicsProcessed?: number;
  totalSuccessfulComics?: number;
  currentComic?: string;
  currentComicChaptersProcessed?: number;
  lastCompletedChapter?: LastCompletedChapter;
  errors?: CrawlerError[];
  timestamp?: string;
  details?: string;
  error?: string;
}

export interface CrawlerResponse {
  status: number;
  code?: string;
  message?: string;
  data?: {
    sessionId: string;
    [key: string]: unknown;
  };
}

export interface CrawlerStatusResponse {
  success: boolean;
  error?: string;
  data?: CrawlerProgress;
}
