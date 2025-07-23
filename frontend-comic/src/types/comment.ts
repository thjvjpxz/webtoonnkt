import { LevelResponse } from "./level";

export interface CommentResponse {
  id: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
  user: UserInfo;
  comic: ComicInfo;
  chapter?: ChapterInfo;
  parent?: ParentCommentInfo;
  replies?: CommentResponse[];
  repliesCount?: number;
}

export interface UserInfo {
  id: string;
  username: string;
  imgUrl: string;
  vip?: boolean;
  level?: LevelResponse;
}

export interface ComicInfo {
  id: string;
  name: string;
  slug: string;
  thumbUrl: string;
}

export interface ChapterInfo {
  id: string;
  title: string;
  chapterNumber: number;
}

export interface ParentCommentInfo {
  id: string;
  content: string;
  user: UserInfo;
}

export enum CommentStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED"
}

export interface CommentRequest {
  content: string;
  comicId: string;
  chapterId?: string;
  parentId?: string;
  status?: CommentStatus;
}

export interface CommentFilters {
  search?: string;
  comicId?: string;
  chapterId?: string;
  userId?: string;
  status?: CommentStatus;
} 