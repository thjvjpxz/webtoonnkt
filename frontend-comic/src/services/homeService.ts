import { ChangePasswordRequest, ComicHome, PopulerToday } from "@/types/home";
import { VipPackage, VipSubscription } from "@/types/vipPackage";
import { fetchApi, fetchApiWithFormData } from "./api";
import { UserWithNextLevel } from "@/types/user";

/**
 * Lấy danh sách truyện theo danh mục
 * @returns Danh sách truyện theo danh mục
 */
export const getComicHome = async () => {
  const response = await fetchApi<ComicHome>('/');
  return response;
}

/**
 * Lấy danh sách truyện theo danh mục
 * @param slug - Slug của danh mục
 * @param page - Trang hiện tại
 * @param limit - Số lượng truyện trên mỗi trang
 * @returns Danh sách truyện theo danh mục
 */
export const getComicBySlugCategory = async (slug: string, page: number, limit: number) => {
  const response = await fetchApi<PopulerToday[]>(`/category/${slug}?page=${page}&limit=${limit}`);
  return response;
}

/**
 * Lấy danh sách truyện theo từ khóa tìm kiếm
 * @param search - Từ khóa tìm kiếm
 * @param page - Trang hiện tại
 * @param limit - Số lượng truyện trên mỗi trang
 * @returns Danh sách truyện theo từ khóa tìm kiếm
 */
export const getComicBySearch = async (search: string, page: number, limit: number) => {
  const response = await fetchApi<PopulerToday[]>(`/search?query=${search}&page=${page}&limit=${limit}`);
  return response;
}

/**
 * Lấy danh sách truyện yêu thích của user
 * @param page - Trang hiện tại
 * @param limit - Số lượng truyện trên mỗi trang
 * @returns Danh sách truyện yêu thích của user
 */
export const getFavoritesComic = async (page: number, limit: number) => {
  const response = await fetchApi<PopulerToday[]>(`/favorites?page=${page}&limit=${limit}`);
  return response;
}

/**
 * Lấy thông tin profile của user
 * @returns Thông tin profile của user
 */
export const getProfile = async () => {
  const response = await fetchApi<UserWithNextLevel>('/profile');
  return response;
}

/**
 * Cập nhật thông tin profile
 * @param data - Dữ liệu để cập nhật thông tin profile
 * @returns true nếu thành công, false nếu không
 */
export const updateProfile = async (data: { levelTypeId: string }) => {
  const response = await fetchApi('/profile', {
    method: 'PUT',
    data: data
  });
  return response;
}

export const updateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetchApiWithFormData('/change-avatar', {
    method: 'PUT',
    data: formData
  });
  return response;
}

/**
 * Thay đổi mật khẩu
 * @param data - Dữ liệu để thay đổi mật khẩu
 * @returns true nếu thành công, false nếu không
 */
export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await fetchApi('/change-password', {
    method: 'POST',
    data: data
  });
  return response;
}

/**
 * Mua vip
 * @param vipPackageId - ID của vip package
 * @returns Thông tin vip package đã mua
 */
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

/**
 * Lấy thông tin vip của user
 * @returns Thông tin vip của user
 */
export const getMyVipSubscription = async () => {
  const endpoint = `/my-vip`

  return await fetchApi<VipSubscription>(endpoint);
}

/**
 * Mua chương
 * @param chapterId - ID của chapter
 * @returns true nếu thành công, false nếu không
 */
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

/**
 * Gửi yêu cầu làm publisher
 * @returns true nếu thành công, false nếu không
 */
export const sendRequestPublisher = async () => {
  const endpoint = `/publisher-request`

  return await fetchApi<null>(endpoint, {
    method: "POST",
  });
}