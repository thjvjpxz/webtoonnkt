import { ComicHome } from "@/types/home"
import { fetchApi } from "./api"

export const getComicHome = async () => {
  const response = await fetchApi<ComicHome>('/');
  return response;
}