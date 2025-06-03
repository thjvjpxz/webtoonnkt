import { Chapter } from "@/types/chapter";

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const constructImageUrl = (chapter: Chapter, imgUrl: string) => {
  if (!chapter.domainCdn || !chapter.chapterPath) {
    return imgUrl;
  }
  return `${chapter.domainCdn}/${chapter.chapterPath}/${imgUrl}`;
};