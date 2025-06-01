import React from "react";
import { StatCardProps } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({
  title,
  value,
  icon,
  change,
  isPositive,
}: StatCardProps) => {
  return (
    <Card className="hover:shadow-medium transition-all duration-200 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-muted-foreground text-sm font-medium mb-2">
              {title}
            </h3>
            <p className="text-3xl font-bold text-foreground mb-1">
              {value}
            </p>
            {change && (
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isPositive
                  ? "status-success"
                  : "status-error"
                }`}>
                <span className="mr-1">
                  {isPositive ? "↗" : "↘"}
                </span>
                {change} so với tháng trước
              </div>
            )}
          </div>
          <div className="bg-primary/10 p-3 rounded-xl text-primary shadow-soft">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
