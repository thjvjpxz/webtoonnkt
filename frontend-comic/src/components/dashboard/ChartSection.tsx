import React from "react";

const ChartSection = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-green-100 dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Thống kê lượt xem</h2>
                <div className="h-80 flex items-center justify-center bg-green-50/50 rounded-lg border border-green-100 dark:bg-gray-700/30 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Biểu đồ thống kê lượt xem sẽ hiển thị ở đây</p>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100 dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Phân bố thể loại</h2>
                <div className="h-80 flex items-center justify-center bg-green-50/50 rounded-lg border border-green-100 dark:bg-gray-700/30 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">Biểu đồ phân bố thể loại sẽ hiển thị ở đây</p>
                </div>
            </div>
        </div>
    );
};

export default ChartSection; 