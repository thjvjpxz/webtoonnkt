import { ComicResponse } from "./comic";

export type Chapter = {
  id: string;
  title: string;
  chapterNumber: number;
  comicName: string;
  status: ChapterStatus;
  domainCdn: string;
  chapterPath: string;
  detailChapters: DetailChapter[];
  createdAt: string;
  updatedAt: string;
}

export type ChapterCreateUpdate = {
  id?: string;
  title: string;
  chapterNumber: number;
  comicId: string;
  status: ChapterStatus;
  detailChapters?: DetailChapterCreateUpdate[];
}

export enum ChapterStatus {
  FEE,
  FREE,
  VIP
}

export type DetailChapterCreateUpdate = {
  imgUrl: string;
  orderNumber: number;
  newImage: boolean;
  hasRemove: boolean;
}

export type DetailChapter = {
  id: string;
  imgUrl: string;
  orderNumber: number;
}

export type DeleteChapterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  comicName: string;
  chapterTitle: string;
  chapterNumber: number;
};

export type ChapterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (chapterData: ChapterCreateUpdate, images: File[]) => void;
  chapter?: Chapter | null;
  comicOptions: ComicResponse[];
};

export type ViewChapterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter | null;
};