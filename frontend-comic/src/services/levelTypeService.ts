import { LevelTypeRequest, LevelTypeResponse } from "@/types/level";
import { fetchApi } from "./api";

const endpoint = '/level-types';

export const getAllLevelTypes = async () => {
  return await fetchApi<LevelTypeResponse[]>(endpoint);
};

export const createLevelType = async (
  data: LevelTypeRequest
) => {
  return await fetchApi<LevelTypeResponse>(endpoint, {
    method: "POST",
    data: data,
  });
};

export const updateLevelType = async (
  id: string,
  data: LevelTypeRequest
) => {
  return await fetchApi<LevelTypeResponse>(`${endpoint}/${id}`, {
    method: "PUT",
    data: data,
  });
};

export const deleteLevelType = async (
  id: string
) => {
  return await fetchApi<LevelTypeResponse>(`${endpoint}/${id}`, {
    method: "DELETE"
  });
};
