import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiBarChart, FiPieChart } from "react-icons/fi";

const ChartSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Biểu đồ lượt xem */}
      <Card className="lg:col-span-2 shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FiBarChart className="text-primary" size={20} />
            Thống kê lượt xem
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80 flex items-center justify-center bg-muted/20 rounded-xl border border-border/30 backdrop-blur-sm">
            <div className="text-center">
              <FiBarChart className="mx-auto mb-3 text-muted-foreground" size={48} />
              <p className="text-muted-foreground font-medium">
                Biểu đồ thống kê lượt xem sẽ hiển thị ở đây
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Dữ liệu được cập nhật theo thời gian thực
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Biểu đồ phân bố thể loại */}
      <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FiPieChart className="text-primary" size={20} />
            Phân bố thể loại
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80 flex items-center justify-center bg-muted/20 rounded-xl border border-border/30 backdrop-blur-sm">
            <div className="text-center">
              <FiPieChart className="mx-auto mb-3 text-muted-foreground" size={48} />
              <p className="text-muted-foreground font-medium">
                Biểu đồ phân bố thể loại sẽ hiển thị ở đây
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Thống kê theo tỷ lệ phần trăm
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartSection;
