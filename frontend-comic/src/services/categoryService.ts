import { CategoryCreateUpdate, CategoryResponse } from "@/types/category";
import { ApiResponse } from "@/types/api";
import { fetchApi } from "./api";

// Lấy danh sách thể loại có phân trang
export const getCategories = async (
  page: number = 1,
  limit: number = 5,
  search?: string
) => {
  let endpoint = `/categories?page=${page}&limit=${limit}`;

  if (search) {
    endpoint += `&search=${encodeURIComponent(search)}`;
  }

  return await fetchApi<CategoryResponse[]>(endpoint);
};

// Lấy chi tiết một thể loại
export const getCategory = async (
  id: number
) => {
  return await fetchApi<CategoryResponse>(`/categories/${id}`);
};

// Tạo thể loại mới
export const createCategory = async (
  data: CategoryCreateUpdate
) => {
  return await fetchApi<CategoryResponse>("/categories", {
    method: "POST",
    data: data,
  });
};

// Cập nhật thể loại
export const updateCategory = async (
  id: string,
  data: CategoryCreateUpdate
) => {
  return await fetchApi<CategoryResponse>(`/categories/${id}`, {
    method: "PUT",
    data: data,
  });
};

// Xóa thể loại
export const deleteCategory = async (
  id: string
) => {
  return await fetchApi<null>(`/categories/${id}`, {
    method: "DELETE",
  });
};

// Lấy tất cả thể loại không phân trang
export const getAllCategories = async () => {
  return await fetchApi<CategoryResponse[]>('/category');
};
