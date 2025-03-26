"use client";

import { FiAlertTriangle } from "react-icons/fi";

type DeleteConfirmModalProps = {
    categoryName: string;
    onClose: () => void;
    onConfirm: () => void;
};

export default function DeleteConfirmModal({ categoryName, onClose, onConfirm }: DeleteConfirmModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md dark:bg-gray-800">
                <div className="p-6">
                    <div className="flex items-center justify-center mb-4 text-rose-500">
                        <FiAlertTriangle size={48} />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-2 dark:text-gray-200">
                        Xác nhận xóa
                    </h3>

                    <p className="text-gray-600 text-center mb-6 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa thể loại <span className="font-semibold">&quot;{categoryName}&quot;</span>? Hành động này không thể hoàn tác.
                    </p>

                    <div className="flex justify-center space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 