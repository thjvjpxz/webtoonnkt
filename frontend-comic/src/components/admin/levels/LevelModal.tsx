"use client";

import { useState, useEffect, useRef } from "react";
import {
  LevelResponse,
  LevelRequest,
  LevelTypeResponse,
} from "@/types/level";
import { FiX, FiUpload } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

    // Kiểm tra validation đơn giản
    if (!formData.name.trim() || !formData.levelTypeId || formData.levelNumber < 0 || formData.expRequired < 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData, file || undefined);
      // onSubmit đã xử lý việc đóng modal
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
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
                className="mt-1 flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-500 dark:border-gray-600 dark:hover:border-green-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700/30"
              >
                <div className="space-y-2 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/gif,image/png,image/jpeg"
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="relative h-40 w-40 mb-3 overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={160}
                          height={160}
                          className="object-cover h-full w-full"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FiUpload className="h-4 w-4" />
                        Nhấp để thay đổi hình ảnh
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="p-4 rounded-full bg-green-50 dark:bg-green-900/20 mb-3">
                        <FiUpload className="mx-auto h-10 w-10 text-green-500 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        Kéo thả hoặc nhấp để tải lên
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PNG, JPG, GIF (tối đa 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-border hover:bg-muted"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? "Đang xử lý..." : (level ? "Cập nhật" : "Thêm mới")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 