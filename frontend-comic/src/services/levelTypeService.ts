import { ApiResponse } from "@/types/api";
import { LevelTypeRequest, LevelTypeResponse } from "@/types/level";
import { fetchApi } from "./api";

const endpoint = '/level-types';

export const getAllLevelTypes = async (): Promise<ApiResponse<LevelTypeResponse[]>> => {
  return await fetchApi<ApiResponse<LevelTypeResponse[]>>(endpoint);
};

export const createLevelType = async (
  data: LevelTypeRequest
): Promise<ApiResponse<LevelTypeResponse>> => {
  return await fetchApi<ApiResponse<LevelTypeResponse>>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateLevelType = async (
  id: string,
  data: LevelTypeRequest
): Promise<ApiResponse<LevelTypeResponse>> => {
  return await fetchApi<ApiResponse<LevelTypeResponse>>(`${endpoint}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteLevelType = async (
  id: string
): Promise<ApiResponse<LevelTypeResponse>> => {
  return await fetchApi<ApiResponse<LevelTypeResponse>>(`${endpoint}/${id}`, {
    method: "DELETE"
  });
};
