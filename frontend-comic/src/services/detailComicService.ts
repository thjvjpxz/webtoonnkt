import { fetchApi } from "./api";
import { ComicDetailResponse } from "@/types/comic";
import { Chapter } from "@/types/chapter";

/**
 * Lấy thông tin truyện theo slug
 * @param slug - Slug của truyện
 * @returns Thông tin truyện
 */
export const getComicBySlug = async (
  slug: string
) => {
  return await fetchApi<ComicDetailResponse>(`/comic/${slug}`);
};

/**
 * Kiểm tra truyện có được theo dõi hay không
 * @param comicId - ID của truyện
 * @returns true nếu được theo dõi, false nếu không
 */
export const checkFollowComic = async (
  comicId: string,
) => {
  return await fetchApi<boolean>(`/comic/${comicId}/check-follow`);
};

/**
 * Theo dõi truyện
 * @param comicId - ID của truyện
 * @returns true nếu thành công, false nếu không
 */
export const followComic = async (
  comicId: string,
) => {
  const url = `/comic/${comicId}/follow`;
  return await fetchApi(
    url,
    {
      method: "POST",
    }
  );
};

/**
 * Bỏ theo dõi truyện
 * @param comicId - ID của truyện
 * @returns true nếu thành công, false nếu không
 */
export const unfollowComic = async (
  comicId: string,
) => {
  const url = `/comic/${comicId}/unfollow`;
  return await fetchApi(
    url,
    {
      method: "POST",
    }
  );
}

/**
 * Lấy danh sách ảnh của chapter
 * @param slug - Slug của truyện
 * @param chapterId - ID của chapter
 * @returns Danh sách ảnh của chapter
 */
export const getChaptersByComicId = async (
  slug: string,
  chapterId: string
) => {
  return await fetchApi<Chapter>(`/comic/${slug}/${chapterId}`);
};

/**
 * Nhận exp khi đọc truyện
 * @returns Thông tin user sau khi nhận exp
 */
export const gainExp = async () => {
  return await fetchApi<null>(`/comic/gain-exp`, {
    method: "POST"
  })
}