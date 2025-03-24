import React from "react";

type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: string;
    isPositive?: boolean;
};

const StatCard = ({ title, value, icon, change, isPositive }: StatCardProps) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-green-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1 dark:text-gray-300">{title}</h3>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{value}</p>
                    {change && (
                        <p className={`text-xs mt-2 ${isPositive ? 'text-green-600' : 'text-rose-500'}`}>
                            {isPositive ? '↑' : '↓'} {change} so với tháng trước
                        </p>
                    )}
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-green-500 dark:bg-green-900/30 dark:text-green-400">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard; 