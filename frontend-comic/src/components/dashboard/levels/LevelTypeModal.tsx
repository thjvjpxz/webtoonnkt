"use client";

import { LevelTypeRequest, LevelTypeResponse } from "@/types/level";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

interface LevelTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LevelTypeRequest) => void;
  levelType: LevelTypeResponse | null;
}

export default function LevelTypeModal({
  isOpen,
  onClose,
  onSubmit,
  levelType,
}: LevelTypeModalProps) {
  const [formData, setFormData] = useState<LevelTypeRequest>({
    name: "",
  });

  useEffect(() => {
    if (levelType) {
      setFormData({
        name: levelType.name,
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [levelType]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSubmit(formData);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {levelType ? "Cập nhật loại level" : "Thêm loại level mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
            >
              Tên loại level
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Nhập tên loại level"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-600 cursor-pointer"
            >
              {levelType ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}