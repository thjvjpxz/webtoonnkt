import { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";
import { fetchApi } from "./api";
import { UserResponse } from "@/types/user";

export const login = async (request: LoginRequest) => {
  let url = '/auth/login';
  const response = await fetchApi<LoginResponse>(url, {
    method: 'POST',
    data: request,
  });

  return response;
};

export const register = async (request: RegisterRequest) => {
  let url = '/auth/register';
  const response = await fetchApi<UserResponse>(url, {
    method: 'POST',
    data: request,
  });

  return response;
}