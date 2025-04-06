"use client";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { CategoryCreateUpdate } from "@/types/category";
import { generateSlug } from "@/utils/string";
import { CategoryModalProps } from "@/types/category";

export default function CategoryModal({
  category,
  onClose,
  onSave,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryCreateUpdate>({
    name: "",
    slug: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    slug: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nếu đang sửa, điền dữ liệu vào form
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
      });
    }
  }, [category]);

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Tự động tạo slug khi thay đổi tên
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  // Xác thực form
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      slug: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Tên thể loại không được để trống";
      valid = false;
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug không được để trống";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Xử lý lưu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSave(formData);
        // onSave sẽ xử lý việc đóng modal sau khi lưu thành công
      } catch (error) {
        console.error("Lỗi khi lưu thể loại:", error);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-green-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {category ? "Sửa thể loại" : "Thêm thể loại mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
            >
              Tên thể loại
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.name ? "border-rose-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-rose-500">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
            >
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.slug ? "border-rose-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-rose-500">{errors.slug}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span className="ml-2">
                    {category ? "Đang cập nhật..." : "Đang thêm mới..."}
                  </span>
                </>
              ) : (
                category ? "Cập nhật" : "Thêm mới"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
