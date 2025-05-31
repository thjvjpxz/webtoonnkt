"use client";

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { CategoryCreateUpdate } from "@/types/category";
import { generateSlug } from "@/utils/string";
import { CategoryModalProps } from "@/types/category";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

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
      <div className="bg-[var(--background)] rounded-xl shadow-lg w-full max-w-md dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-[var(--border)] dark:border-gray-700">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {category ? "Sửa thể loại" : "Thêm thể loại mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-primary)] hover:text-[var(--primary)] dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            id="name"
            name="name"
            label="Tên thể loại"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />

          <Input
            id="slug"
            name="slug"
            label="Slug"
            value={formData.slug}
            onChange={handleChange}
            error={errors.slug}
          />

          <Textarea
            id="description"
            name="description"
            label="Mô tả"
            value={formData.description || ""}
            onChange={handleChange}
            rows={3}
          />

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              size="md"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="success"
              size="md"
              isLoading={isSubmitting}
            >
              {category ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
