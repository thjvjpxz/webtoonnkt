import { LoginRequest, LoginResponse } from "@/types/auth";
import { fetchApi } from "./api";

export const login = async (request: LoginRequest) => {
  let url = '/auth/login';
  const response = await fetchApi<LoginResponse>(url, {
    method: 'POST',
    data: request,
  });

  return response;
};

