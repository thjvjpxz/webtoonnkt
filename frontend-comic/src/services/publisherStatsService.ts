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

/**
 * Helper function để format date thành ISO string cho API
 * @param date - Date object
 * @returns ISO datetime string
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString();
}

/**
 * Helper function để tạo params cho range query với Date objects
 * @param startDate - Ngày bắt đầu
 * @param endDate - Ngày kết thúc
 * @returns PersonalStatsDateRangeParams
 */
export function createDateRangeParams(
  startDate: Date,
  endDate: Date
): PersonalStatsDateRangeParams {
  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate)
  };
} 