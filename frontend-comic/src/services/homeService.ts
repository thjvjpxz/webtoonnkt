import { ChangePasswordRequest, ComicHome, PopulerToday } from "@/types/home";
import { UserResponse } from "@/types/user";
import { fetchApi } from "./api";
import { VipPackage, VipSubscription } from "@/types/vipPackage";

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

export const getFavoritesComic = async (page: number, limit: number) => {
  const response = await fetchApi<PopulerToday[]>(`/favorites?page=${page}&limit=${limit}`);
  return response;
}

export const getProfile = async () => {
  const response = await fetchApi<UserResponse>('/profile');
  return response;
}

// Cập nhật thông tin profile
export const updateProfile = async (data: { levelTypeId: string }) => {
  const response = await fetchApi('/profile', {
    method: 'PUT',
    data: data
  });
  return response;
}

export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await fetchApi('/change-password', {
    method: 'POST',
    data: data
  });
  return response;
}

// Mua vip
export const buyVipPackage = async (vipPackageId: string) => {
  const endpoint = `/purchase/vip`;

  const data = {
    vipPackageId: vipPackageId,
  }

  return await fetchApi<VipPackage>(endpoint, {
    method: "POST",
    data: data,
  });
}

export const getMyVipSubscription = async () => {
  const endpoint = `/my-vip`

  return await fetchApi<VipSubscription>(endpoint);
}


// Mua chương
export const buyChapter = async (chapterId: string) => {
  const endpoint = `/purchase/chapter`;

  const data = {
    chapterId: chapterId,
  }

  return await fetchApi<null>(endpoint, {
    method: "POST",
    data: data,
  });
}