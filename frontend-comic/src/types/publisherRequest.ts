import { LevelResponse } from "./level";

export interface PublisherRequest {
  id: string;
  userId: string;
  username: string;
  level: LevelResponse;
  status: PublisherRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export enum PublisherRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}