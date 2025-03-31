import { ApiResponse, ComicCreateUpdate, ComicResponse } from "@/types/api";
import { fetchApi, fetchApiWithFormData } from "./api";

// Lấy danh sách truyện có phân trang
export const getComics = async (
  page: number = 1,
  limit: number = 5,
  search?: string,
  status?: string,
  category?: string
): Promise<ApiResponse<ComicResponse[]>> => {
  let endpoint = `/comics?page=${page}&limit=${limit}`;

  if (search) {
    endpoint += `&search=${encodeURIComponent(search)}`;
  }

  if (status) {
    endpoint += `&status=${status}`;
  }

  if (category) {
    endpoint += `&category=${category}`;
  }

  return await fetchApi<ApiResponse<ComicResponse[]>>(endpoint);
};

// Lấy chi tiết một truyện
export const getComic = async (
  id: number
): Promise<ApiResponse<ComicResponse>> => {
  return await fetchApi<ApiResponse<ComicResponse>>(`/comics/${id}`);
};

// Tạo truyện mới
export const createComic = async (
  data: ComicCreateUpdate
): Promise<ApiResponse<ComicResponse>> => {
  return await fetchApiWithFormData<ApiResponse<ComicResponse>>("/comics", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Cập nhật truyện
export const updateComic = async (
  id: number,
  data: ComicCreateUpdate
): Promise<ApiResponse<ComicResponse>> => {
  return await fetchApiWithFormData<ApiResponse<ComicResponse>>(`/comics/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Xóa truyện
export const deleteComic = async (id: number): Promise<ApiResponse<null>> => {
  return await fetchApi<ApiResponse<null>>(`/comics/${id}`, {
    method: "DELETE",
  });
};

// Tải lên ảnh bìa
export const uploadCoverImage = async (
  file: File
): Promise<ApiResponse<{ url: string }>> => {
  const formData = new FormData();
  formData.append("file", file);

  return await fetchApiWithFormData<ApiResponse<{ url: string }>>("/upload/thumbnail", {
    method: "POST",
    body: formData,
    headers: {},
  });
};

// Tạo truyện mới với ảnh bìa
export const createComicWithCover = async (
  data: ComicCreateUpdate,
  file: File
): Promise<ApiResponse<ComicResponse>> => {

  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  formData.append('cover', file);

  return await fetchApiWithFormData<ApiResponse<ComicResponse>>("/comics", {
    method: "POST",
    body: formData,
  });
};

// Cập nhật truyện với ảnh bìa
export const updateComicWithCover = async (
  id: number,
  data: ComicCreateUpdate,
  file: File
): Promise<ApiResponse<ComicResponse>> => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  formData.append('cover', file);


  return await fetchApiWithFormData<ApiResponse<ComicResponse>>(`/comics/${id}`, {
    method: "PUT",
    body: formData,
  });
};
