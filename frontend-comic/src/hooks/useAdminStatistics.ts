import { useState, useEffect } from 'react';
import { AdminStatistics } from '@/types/statistics';
import toast from 'react-hot-toast';
import { getStatistics } from '@/services/dashboardService';

export function useAdminStatistics() {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getStatistics();

      if (response.status === 200 && response.data) {
        setStatistics(response.data);
      } else {
        setError(response.message || 'Không thể tải dữ liệu thống kê');
        toast.error(response.message || 'Không thể tải dữ liệu thống kê');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    isLoading,
    error,
    refetch: fetchStatistics
  };
} 