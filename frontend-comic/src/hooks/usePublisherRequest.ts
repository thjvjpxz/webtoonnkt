import { useState, useEffect, useCallback } from "react";
import { PublisherRequest, PublisherRequestStatus } from "@/types/publisherRequest";
import { getPublisherRequests, updatePublisherRequest } from "@/services/publisherRequestService";
import toast from "react-hot-toast";

export function usePublisherRequest() {
  const [publisherRequests, setPublisherRequests] = useState<PublisherRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PublisherRequestStatus | "">("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const limit = 10;

  // Fetch publisher requests
  const fetchPublisherRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getPublisherRequests(
        currentPage,
        limit,
        searchTerm || undefined,
        statusFilter || undefined
      );

      if (response.status === 200 && response.data) {
        setPublisherRequests(response.data);
        // Giả sử API trả về pagination info, nếu không thì cần điều chỉnh
        setTotalPages(Math.ceil((response.total || response.data.length) / limit));
      } else {
        throw new Error(response.message || "Không thể tải danh sách yêu cầu");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  // Update publisher request status
  const handleUpdateStatus = async (id: string, status: PublisherRequestStatus) => {
    try {
      setIsUpdating(id);

      const response = await updatePublisherRequest(id, status);

      if (response.status === 200 && response.message) {
        toast.success(response.message);
        fetchPublisherRequests();
      } else {
        throw new Error(response.message || "Không thể cập nhật trạng thái");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(null);
    }
  };

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  }, []);

  // Handle status filter
  const handleStatusFilter = useCallback((status: PublisherRequestStatus | "") => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset về trang đầu khi lọc
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Load data when dependencies change
  useEffect(() => {
    fetchPublisherRequests();
  }, [fetchPublisherRequests]);

  return {
    // Data
    publisherRequests,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchTerm,
    statusFilter,
    isUpdating,

    // Actions
    setCurrentPage,
    setSearchTerm,
    setStatusFilter,
    handleSearch,
    handleStatusFilter,
    handlePageChange,
    handleUpdateStatus,
    fetchPublisherRequests,
  };
} 