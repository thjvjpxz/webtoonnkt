import { ComicHome, PopulerToday } from "@/types/home"
import { fetchApi } from "./api"

export const getComicHome = async () => {
  const response = await fetchApi<ComicHome>('/');
  return response;
}

export const getComicBySlugCategory = async (slug: string, page: number, limit: number) => {
  const response = await fetchApi<PopulerToday[]>(`/category/${slug}?page=${page}&limit=${limit}`);
  return response;
}

export const getComicBySearch = async (search: string, page: number, limit: number) => {
  const response = await fetchApi<PopulerToday[]>(`/search?query=${search}&page=${page}&limit=${limit}`);
  return response;
}