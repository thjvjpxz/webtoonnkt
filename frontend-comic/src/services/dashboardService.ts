import { fetchApi } from './api';
import { AdminStatistics } from '@/types/statistics';

export const getStatistics = async () => {
  const response = await fetchApi<AdminStatistics>('/admin/statistics', {
    method: 'GET',
  });

  return response;
}; 