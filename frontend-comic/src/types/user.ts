import { LevelResponse } from "./level";

export type Role = {
  id: string;
  name: string;
  description: string;
}

export type UserCreateUpdate = {
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

export type UserResponse = {
  id: string;
  username: string;
  email: string;
  imgUrl: string;
  vip: boolean;
  active: boolean;
  blocked: boolean;
  role: Role;
  balance: number;
  lastTopup: Date;
  level: LevelResponse;
  currentExp: number;
  createdAt: string;
  updatedAt: string;
}

export type UserModalProps = {
  user: UserResponse | null;
  roles: Role[];
  onClose: () => void;
  onSave: (userData: UserCreateUpdate, file?: File) => Promise<void>;
};

export type DeleteUserModalProps = {
  username: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
};