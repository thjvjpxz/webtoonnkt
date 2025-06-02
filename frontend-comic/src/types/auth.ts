import { Role } from "./user";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  username: string;
  imgUrl: string;
  vip: boolean;
  role: Role;
}