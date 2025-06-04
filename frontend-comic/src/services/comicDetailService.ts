import { fetchApi } from "./api";
import { ComicDetailResponse } from "@/types/comic";
import { Chapter } from "@/types/chapter";

// Lấy chi tiết một truyện theo slug cho page chi tiết truyện
export const getComicBySlug = async (
  slug: string
) => {
  return await fetchApi<ComicDetailResponse>(`/comic/${slug}`);
};

export const checkFollowComic = async (
  comicId: string,
) => {
  return await fetchApi<boolean>(`/comic/${comicId}/check-follow`);
};

// Theo dõi truyện
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

// Bỏ theo dõi truyện
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

// Lấy danh sách chapter của truyện
export const getChaptersByComicId = async (
  slug: string,
  chapterId: string
) => {
  return await fetchApi<Chapter>(`/comic/${slug}/${chapterId}`);
};

