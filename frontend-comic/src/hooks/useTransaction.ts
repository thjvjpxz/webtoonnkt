"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getAllTransactions, getTransactionStats } from "@/services/paymentService";
import { TransactionResponse, TransactionStatsResponse } from "@/types/payment";

export function useTransaction() {
  // State quản lý danh sách giao dịch
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [stats, setStats] = useState<TransactionStatsResponse | null>(null);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("");

  // State cho xử lý lỗi
  const [error, setError] = useState<string | null>(null);

  // Hàm tải dữ liệu giao dịch
  const fetchTransactions = useCallback(async (
    page: number = 1,
    search: string = "",
    status: string = "",
    paymentMethod: string = ""
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const limit = 10; // Số lượng giao dịch mỗi trang
      const response = await getAllTransactions(page, limit, search, status, paymentMethod);

      if (response && response.data) {
        setTransactions(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setTransactions([]);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách giao dịch:", error);
      setError("Không thể tải danh sách giao dịch");
      toast.error("Không thể tải danh sách giao dịch");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hàm tải thống kê giao dịch
  const fetchTransactionStats = useCallback(async () => {
    try {
      const response = await getTransactionStats();
      if (response && response.data) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error("Lỗi khi tải thống kê giao dịch:", error);
      toast.error("Không thể tải thống kê giao dịch");
    }
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTransactions(1, searchTerm, statusFilter, paymentMethodFilter);
  }, [searchTerm, statusFilter, paymentMethodFilter, fetchTransactions]);

  // Hàm xử lý thay đổi trang
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchTransactions(page, searchTerm, statusFilter, paymentMethodFilter);
  }, [searchTerm, statusFilter, paymentMethodFilter, fetchTransactions]);

  // Hàm xử lý thay đổi bộ lọc trạng thái
  const handleStatusFilterChange = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchTransactions(1, searchTerm, status, paymentMethodFilter);
  }, [searchTerm, paymentMethodFilter, fetchTransactions]);

  // Hàm xử lý thay đổi bộ lọc phương thức thanh toán
  const handlePaymentMethodFilterChange = useCallback((paymentMethod: string) => {
    setPaymentMethodFilter(paymentMethod);
    setCurrentPage(1);
    fetchTransactions(1, searchTerm, statusFilter, paymentMethod);
  }, [searchTerm, statusFilter, fetchTransactions]);

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchTransactions();
    fetchTransactionStats();
  }, [fetchTransactions, fetchTransactionStats]);

  // Hàm refresh dữ liệu
  const refreshData = useCallback(() => {
    fetchTransactions(currentPage, searchTerm, statusFilter, paymentMethodFilter);
    fetchTransactionStats();
  }, [currentPage, searchTerm, statusFilter, paymentMethodFilter, fetchTransactions, fetchTransactionStats]);

  return {
    // Data
    transactions,
    stats,

    // Pagination
    currentPage,
    totalPages,

    // Loading & Error states
    isLoading,
    error,

    // Filters
    searchTerm,
    statusFilter,
    paymentMethodFilter,

    // Actions
    setSearchTerm,
    handleSearch,
    handlePageChange,
    handleStatusFilterChange,
    handlePaymentMethodFilterChange,
    refreshData,
  };
} 