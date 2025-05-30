import React from "react";
import StatCard from "./StatCard";
import { FiBook, FiEye, FiUser, FiMessageSquare } from "react-icons/fi";

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Tổng số truyện"
        value="1,254"
        icon={<FiBook size={24} />}
        change="12%"
        isPositive={true}
      />
      <StatCard
        title="Lượt xem hôm nay"
        value="45,678"
        icon={<FiEye size={24} />}
        change="8%"
        isPositive={true}
      />
      <StatCard
        title="Người dùng mới"
        value="328"
        icon={<FiUser size={24} />}
        change="5%"
        isPositive={true}
      />
      <StatCard
        title="Bình luận mới"
        value="156"
        icon={<FiMessageSquare size={24} />}
        change="3%"
        isPositive={false}
      />
    </div>
  );
};

export default StatsOverview;
