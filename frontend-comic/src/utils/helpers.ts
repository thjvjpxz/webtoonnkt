import { Chapter } from "@/types/chapter";
import { differenceInDays, format, formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export const formatDate = (dateString: string) => {

  const date = parseISO(dateString);

  const diff = differenceInDays(new Date(), date);
  console.log(diff);

  if (diff < 1) {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: vi,
    });
  }

  return format(date, "dd/MM/yyyy");
};

export const constructImageUrl = (chapter: Chapter, imgUrl: string) => {
  if (!chapter.domainCdn || !chapter.chapterPath) {
    return imgUrl;
  }
  return `${chapter.domainCdn}/${chapter.chapterPath}/${imgUrl}`;
};