import { ApiResponse } from "@/types/api";
import { LevelRequest, LevelResponse } from "@/types/level";
import { fetchApi, fetchApiWithFormData } from "./api";

const endpoint = '/levels';

export const getAllLevels = async (
  page: number = 1,
  limit: number = 5,
  search?: string
): Promise<ApiResponse<LevelResponse[]>> => {
  let fullEndpoint = `${endpoint}?page=${page}&limit=${limit}`;

  if (search) {
    fullEndpoint += `&search=${search}`;
  }

  return await fetchApi<ApiResponse<LevelResponse[]>>(fullEndpoint);
};

export const createLevel = async (
  data: LevelRequest,
  file?: File
): Promise<ApiResponse<LevelResponse>> => {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (file) {
    formData.append("cover", file);
  }

  return await fetchApiWithFormData<ApiResponse<LevelResponse>>(endpoint, {
    method: "POST",
    body: formData,
  });
};

export const updateLevel = async (
  id: string,
  data: LevelRequest,
  file?: File
): Promise<ApiResponse<LevelResponse>> => {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (file) {
    formData.append("cover", file);
  }

  return await fetchApiWithFormData<ApiResponse<LevelResponse>>(`${endpoint}/${id}`, {
    method: "PUT",
    body: formData,
  });
};

export const deleteLevel = async (
  id: string
): Promise<ApiResponse<LevelResponse>> => {
  return await fetchApi<ApiResponse<LevelResponse>>(`${endpoint}/${id}`, {
    method: "DELETE",
  });
};
