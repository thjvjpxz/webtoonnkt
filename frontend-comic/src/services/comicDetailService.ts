import { ApiResponse } from "@/types/api";
import { fetchApi } from "./api";
import { ComicDetailResponse } from "@/types/comic";
import { Chapter } from "@/types/chapter";

// Lấy chi tiết một truyện theo slug cho page chi tiết truyện
export const getComicBySlug = async (
  slug: string
): Promise<ApiResponse<ComicDetailResponse>> => {
  return await fetchApi<ComicDetailResponse>(`/comic/${slug}`);
};

export const checkFollowComic = async (
  comicId: string,
): Promise<ApiResponse<boolean>> => {
  return await fetchApi<boolean>(`/comic/${comicId}/check-follow`);
};

// Theo dõi truyện
export const followComic = async (
  comicId: string,
): Promise<ApiResponse<null>> => {
  let url = `/comic/${comicId}/follow`;
  return await fetchApi<null>(
    url,
    {
      method: "POST",
    }
  );
};

// Bỏ theo dõi truyện
export const unfollowComic = async (
  comicId: string,
): Promise<ApiResponse<null>> => {
  let url = `/comic/${comicId}/unfollow`;
  return await fetchApi<null>(
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
): Promise<ApiResponse<Chapter>> => {
  return await fetchApi<Chapter>(`/comic/${slug}/${chapterId}`);
};

