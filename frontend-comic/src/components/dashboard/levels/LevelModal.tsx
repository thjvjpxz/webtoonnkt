"use client";

import { useState, useEffect, useRef } from "react";
import {
  LevelResponse,
  LevelRequest,
  LevelTypeResponse,
} from "@/types/level";
import { FiX, FiUpload } from "react-icons/fi";

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LevelRequest, file?: File) => void;
  level: LevelResponse | null;
  levelTypes: LevelTypeResponse[];
}

export default function LevelModal({
  isOpen,
  onClose,
  onSubmit,
  level,
  levelTypes,
}: LevelModalProps) {
  const [formData, setFormData] = useState<LevelRequest>({
    name: "",
    levelNumber: 0,
    color: "#000000",
    expRequired: 0,
    levelTypeId: "",
    urlGif: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Điền dữ liệu vào form khi sửa
  useEffect(() => {
    if (level) {
      setFormData({
        name: level.name,
        levelNumber: level.levelNumber,
        color: level.color,
        expRequired: level.expRequired,
        levelTypeId: level.levelType.id,
        urlGif: level.urlGif,
      });
      setPreviewUrl(level.urlGif);
    } else {
      // Reset form khi thêm mới
      setFormData({
        name: "",
        levelNumber: 0,
        color: "#000000",
        expRequired: 0,
        levelTypeId: levelTypes.length > 0 ? levelTypes[0].id : "",
        urlGif: "",
      });
      setPreviewUrl(null);
      setFile(null);
    }
  }, [level, levelTypes]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "levelNumber" || name === "expRequired"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Tạo URL preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData, file || undefined);
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 dark:bg-gray-800 dark:border dark:border-gray-700 my-8 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {level ? "Cập nhật level" : "Thêm level mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          {/* Overlay loading khi đang submit */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-gray-900/20 dark:bg-gray-900/40 flex items-center justify-center rounded-xl z-10">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="h-6 w-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {level ? "Đang cập nhật level..." : "Đang thêm level mới..."}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Tên level
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Nhập tên level"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="levelTypeId"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Loại level
              </label>
              <select
                id="levelTypeId"
                name="levelTypeId"
                required
                value={formData.levelTypeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Chọn loại level</option>
                {levelTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="levelNumber"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Số level
              </label>
              <input
                type="number"
                id="levelNumber"
                name="levelNumber"
                required
                min="0"
                value={formData.levelNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Nhập số level"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="expRequired"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Điểm kinh nghiệm
              </label>
              <input
                type="number"
                id="expRequired"
                name="expRequired"
                required
                min="0"
                value={formData.expRequired}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Nhập điểm kinh nghiệm cần thiết"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Màu sắc
              </label>
              <input
                type="color"
                id="color"
                name="color"
                required
                value={formData.color}
                onChange={handleChange}
                className="h-10 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="mb-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                Hình ảnh GIF
              </label>
              <div
                onClick={openFileInput}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-green-500 dark:border-gray-600 dark:hover:border-green-500"
              >
                <div className="space-y-1 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/gif,image/png,image/jpeg"
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Nhấp để thay đổi hình ảnh
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Nhấp để tải lên hình ảnh (PNG, JPG, GIF tối đa 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {level ? "Đang cập nhật..." : "Đang thêm..."}
                </>
              ) : level ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 