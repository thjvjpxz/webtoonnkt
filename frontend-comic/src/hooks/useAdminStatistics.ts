import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';
import { AdminStatistics } from '@/types/statistics';
import toast from 'react-hot-toast';

export function useAdminStatistics() {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dữ liệu thống kê từ API /admin/statistics
  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await dashboardService.getStatistics();

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