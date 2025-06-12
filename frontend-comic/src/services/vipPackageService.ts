import { VipPackage, VipPackageCreateUpdate } from "@/types/vipPackage";
import { fetchApi } from "./api";

export const getAllVipPackages = async (
  page: number = 1,
  limit: number = 5,
  search?: string,
  status?: boolean
) => {
  let endpoint = `/vip-packages?page=${page}&limit=${limit}`;

  if (search) {
    endpoint += `&search=${encodeURIComponent(search)}`;
  }

  if (status !== undefined) {
    endpoint += `&isActive=${status}`;
  }

  return await fetchApi<VipPackage[]>(endpoint);
}

export const createVipPackage = async (data: VipPackageCreateUpdate) => {
  const endpoint = `/vip-packages`;

  return await fetchApi<VipPackage>(endpoint, {
    method: "POST",
    data: data,
  });
}

export const updateVipPackage = async (id: string, data: VipPackageCreateUpdate) => {
  const endpoint = `/vip-packages/${id}`;

  return await fetchApi<VipPackage>(endpoint, {
    method: "PUT",
    data: data,
  });
}

export const deleteVipPackage = async (id: string) => {
  const endpoint = `/vip-packages/${id}`;

  return await fetchApi<VipPackage>(endpoint, {
    method: "DELETE",
  });
}

export const permanentDeleteVipPackage = async (id: string) => {
  const endpoint = `/vip-packages/${id}/permanent`;

  return await fetchApi<VipPackage>(endpoint, {
    method: "DELETE",
  });
}

export const getPublicVipPackages = async () => {
  const endpoint = `/public/vip-packages`;

  return await fetchApi<VipPackage[]>(endpoint);
}