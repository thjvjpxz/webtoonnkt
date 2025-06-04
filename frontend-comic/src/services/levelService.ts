import { LevelRequest, LevelResponse } from "@/types/level";
import { fetchApi, fetchApiWithFormData } from "./api";

const endpoint = '/levels';

export const getAllLevels = async (
  page: number = 1,
  limit: number = 5,
  search?: string
) => {
  let fullEndpoint = `${endpoint}?page=${page}&limit=${limit}`;

  if (search) {
    fullEndpoint += `&search=${search}`;
  }

  return await fetchApi<LevelResponse[]>(fullEndpoint);
};

export const createLevel = async (
  data: LevelRequest,
  file?: File
) => {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (file) {
    formData.append("cover", file);
  }

  return await fetchApiWithFormData<LevelResponse>(endpoint, {
    method: "POST",
    data: formData,
  });
};

export const updateLevel = async (
  id: string,
  data: LevelRequest,
  file?: File
) => {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (file) {
    formData.append("cover", file);
  }

  return await fetchApiWithFormData<LevelResponse>(`${endpoint}/${id}`, {
    method: "PUT",
    data: formData,
  });
};

export const deleteLevel = async (
  id: string
) => {
  return await fetchApi<LevelResponse>(`${endpoint}/${id}`, {
    method: "DELETE",
  });
};
