"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import StatisticsCards from "@/components/admin/stats/StatisticsCards";
import StatisticsCharts from "@/components/admin/stats/StatisticsCharts";
import QuickMetrics from "@/components/admin/stats/QuickMetrics";
import TransactionStats from "@/components/admin/stats/TransactionStats";
import { useAdminStatistics } from "@/hooks/useAdminStatistics";
import { Button } from "@/components/ui/button";
import { FiRefreshCw } from "react-icons/fi";

// Component Dashboard chính
export default function Dashboard() {
  const { statistics, isLoading, error, refetch } = useAdminStatistics();


  return (
    <DashboardLayout title="Tổng quan">
      {/* Header với nút refresh */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Thống kê tổng quan</h1>
        <Button
          onClick={refetch}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <FiRefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Lỗi tải dữ liệu:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Statistics Cards với dữ liệu từ API */}
      <div className="mb-6">
        <StatisticsCards statistics={statistics} isLoading={isLoading} />
      </div>

      {/* Quick Metrics - Tăng trưởng */}
      <div className="mb-6">
        <QuickMetrics statistics={statistics} isLoading={isLoading} />
      </div>

      {/* Charts và Stats với dữ liệu từ API */}
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <StatisticsCharts statistics={statistics} isLoading={isLoading} />
          </div>
          <div>
            <TransactionStats statistics={statistics} isLoading={isLoading} />
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
}
