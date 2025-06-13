import { Chapter } from "@/types/chapter";
import { differenceInDays, format, formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Format date string thành định dạng dd/MM/yyyy hoặc thời gian gần đây nếu trong ngày
 * @param dateString - Date string
 * @returns Date string đã được format
 */
export const formatDate = (dateString: string) => {
  if (!dateString) {
    return "Không có";
  }

  const date = parseISO(dateString);
  const diff = differenceInDays(new Date(), date);

  if (diff < 1) {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: vi,
    });
  }

  return format(date, "dd/MM/yyyy");
};

/**
 * Tạo URL ảnh từ chapter và imgUrl đối với domainCdn = sv1.otruyencdn.com
 * @param chapter - Chapter object
 * @param imgUrl - URL ảnh
 * @returns URL ảnh đã được tạo
 */
export const constructImageUrl = (chapter: Chapter, imgUrl: string) => {
  if (!chapter.domainCdn || !chapter.chapterPath) {
    return imgUrl;
  }
  return `${chapter.domainCdn}/${chapter.chapterPath}/${imgUrl}`;
};