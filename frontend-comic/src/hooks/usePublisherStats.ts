// Custom hook để quản lý thống kê cá nhân của publisher
import { useState, useEffect } from 'react';
import {
  getPersonalStats,
  getPersonalStatsInRange,
  createDateRangeParams
} from '@/services/publisherStatsService';
import {
  PublisherPersonalStatsResponse,
  PersonalStatsDateRangeParams
} from '@/types/publisherStats';
import { handleApiError } from '@/services/api';
import toast from 'react-hot-toast';

interface UsePublisherStatsReturn {
  stats: PublisherPersonalStatsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchStatsInRange: (startDate: Date, endDate: Date) => Promise<void>;
  fetchStatsInRangeWithParams: (params: PersonalStatsDateRangeParams) => Promise<void>;
}

/**
 * Hook để quản lý thống kê cá nhân của publisher
 * @param autoFetch - Tự động fetch data khi mount (mặc định: true)
 * @returns Object chứa stats, loading state và các functions
 */
export function usePublisherStats(autoFetch: boolean = true): UsePublisherStatsReturn {
  const [stats, setStats] = useState<PublisherPersonalStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch thống kê cơ bản
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getPersonalStats();

      if (response.status === 200 && response.data) {
        setStats(response.data);
      } else {
        const errorMsg = response.message || 'Không thể lấy thống kê';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch thống kê theo khoảng thời gian (với Date objects)
  const fetchStatsInRange = async (startDate: Date, endDate: Date) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = createDateRangeParams(startDate, endDate);
      const response = await getPersonalStatsInRange(params);

      if (response.status === 200 && response.data) {
        setStats(response.data);
      } else {
        const errorMsg = response.message || 'Không thể lấy thống kê theo khoảng thời gian';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch thống kê theo khoảng thời gian (với params đã format)
  const fetchStatsInRangeWithParams = async (params: PersonalStatsDateRangeParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getPersonalStatsInRange(params);

      if (response.status === 200 && response.data) {
        setStats(response.data);
      } else {
        const errorMsg = response.message || 'Không thể lấy thống kê theo khoảng thời gian';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto fetch khi component mount
  useEffect(() => {
    if (autoFetch) {
      fetchStats();
    }
  }, [autoFetch]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
    fetchStatsInRange,
    fetchStatsInRangeWithParams,
  };
} 