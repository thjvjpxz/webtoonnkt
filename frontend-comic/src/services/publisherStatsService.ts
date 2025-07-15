// Service để gọi API thống kê cá nhân của publisher
import { fetchApi } from "./api";
import {
  PublisherPersonalStatsResponse,
  PersonalStatsDateRangeParams
} from "@/types/publisherStats";

/**
 * Lấy thống kê cá nhân của publisher hiện tại
 * @returns Promise<PublisherPersonalStatsResponse>
 */
export async function getPersonalStats() {
  return fetchApi<PublisherPersonalStatsResponse>('/publisher/stats/personal', {
    method: 'GET'
  });
}

/**
 * Lấy thống kê cá nhân của publisher theo khoảng thời gian
 * @param params - Tham số startDate và endDate
 * @returns Promise<PublisherPersonalStatsResponse>
 */
export async function getPersonalStatsInRange(params: PersonalStatsDateRangeParams) {
  return fetchApi<PublisherPersonalStatsResponse>('/publisher/stats/personal/range', {
    method: 'GET',
    params: {
      startDate: params.startDate,
      endDate: params.endDate
    }
  });
}