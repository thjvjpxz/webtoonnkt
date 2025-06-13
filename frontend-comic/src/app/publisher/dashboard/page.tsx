"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import { PublisherStats } from "@/components/publisher/PublisherStats";
import { useAuthState } from "@/hooks/useAuthState";

export default function PublisherDashboard() {
  const { isPublisher } = useAuthState();

  if (!isPublisher) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  return (
    <DashboardLayout title="Tổng quan" isPublisher={true}>
      <PublisherStats />
    </DashboardLayout>
  )
}