import { LevelResponse } from "./level";

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface UserCreateUpdate {
  username: string;
  email: string;
  password?: string;
  imgUrl?: string;
  vip?: boolean;
  active?: boolean;
  roleId?: string;
  levelId?: string;
  balance?: number;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  imgUrl: string;
  vip: boolean;
  active: boolean;
  blocked: boolean;
  deleted: boolean;
  role: Role;
  balance: number;
  lastTopup: Date;
  level: LevelResponse;
  currentExp: number;
  createdAt: string;
  updatedAt: string;
}



