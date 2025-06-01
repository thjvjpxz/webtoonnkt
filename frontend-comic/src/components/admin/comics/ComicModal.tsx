"use client";

import { Button } from "@/components/ui/button";
import { CategoryResponse } from "@/types/category";
import { ComicCreateUpdate, ComicResponse } from "@/types/comic";
import { generateSlug } from "@/utils/string";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { FiCheck, FiImage, FiUpload, FiX } from "react-icons/fi";

interface ComicModalProps {
  comic: ComicResponse | null;
  categories: CategoryResponse[];
  onClose: () => void;
  onSave: (comic: ComicCreateUpdate, file?: File) => Promise<void>;
}

export default function ComicModal({
  comic,
  categories,
  onClose,
  onSave,
}: ComicModalProps) {
  const [formData, setFormData] = useState<ComicCreateUpdate>({
    name: "",
    slug: "",
    description: "",
    author: "",
    status: "ONGOING",
    categories: [],
    thumbUrl: "",
    originName: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    slug: "",
    categories: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nếu đang sửa, điền dữ liệu vào form
  useEffect(() => {
    if (comic) {
      setFormData({
        name: comic.name || "",
        slug: comic.slug || "",
        description: comic.description || "",
        author: comic.author || "",
        thumbUrl: comic.thumbUrl || "",
        status: comic.status || "ONGOING",
        originName: comic.originName || "",
        categories: comic.categories?.map((cat) => cat.id) || [],
      });
      setPreviewImage(comic.thumbUrl || "");

      // Nếu có thumbUrl, đặt phương thức tải lên là URL
      if (comic.thumbUrl) {
        setImageUrl(comic.thumbUrl);
        setUploadMethod("url");
      }
    }
  }, [comic]);

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  // Xử lý thêm thể loại
  const handleAddCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, categoryId],
    }));
    setCategorySearchTerm("");
  };

  // Xử lý xóa thể loại
  const handleRemoveCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((id) => id !== categoryId),
    }));
  };

  // Đóng dropdown khi click ra ngoài hoặc focus vào input khác
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".category-dropdown-container") && isCategoryDropdownOpen) {
        setIsCategoryDropdownOpen(false);
      }
    };

    const handleFocusChange = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      // Nếu focus vào phần tử không phải input tìm kiếm thể loại
      if (!target.closest(".category-dropdown-container") && isCategoryDropdownOpen) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("focusin", handleFocusChange);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("focusin", handleFocusChange);
    };
  }, [isCategoryDropdownOpen]);

  // Xử lý tải lên ảnh bìa
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFileUpload(file);
  };

  // Mở hộp thoại chọn file
  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Xác thực form
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      slug: "",
      categories: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Tên truyện không được để trống";
      valid = false;
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug không được để trống";
      valid = false;
    }

    if (formData.categories.length === 0) {
      newErrors.categories = "Vui lòng chọn ít nhất một thể loại";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Xử lý lưu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Cập nhật formData với URL ảnh nếu đang sử dụng phương thức URL
    const dataToSubmit = { ...formData };
    if (uploadMethod === "url" && imageUrl.trim()) {
      dataToSubmit.thumbUrl = imageUrl;
    }

    setIsSubmitting(true);
    setIsUploading(true);
    try {
      // Gọi hàm onSave với dữ liệu và file (nếu có)
      await onSave(
        dataToSubmit,
        uploadMethod === "file" && selectedFile ? selectedFile : undefined
      );
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi lưu truyện");
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  // Xử lý khi người dùng nhập URL ảnh
  const handleImageUrlSubmit = () => {
    if (!imageUrl.trim()) return;

    setIsUploading(true);

    // Sử dụng window.Image thay vì Image
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setPreviewImage(imageUrl);
      setFormData((prev) => ({
        ...prev,
        thumbUrl: imageUrl,
      }));
      setIsUploading(false);
      toast.success("Đã thêm ảnh bìa từ URL");
    };

    img.onerror = () => {
      setIsUploading(false);
      toast.error("URL ảnh không hợp lệ hoặc không thể truy cập");
    };

    img.src = imageUrl;
  };

  // Xử lý sự kiện kéo thả
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Tách logic xử lý file
  const handleFileUpload = (file: File) => {
    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    // Kiểm tra kích thước file (giới hạn 2MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 10MB");
      return;
    }

    // Lưu file đã chọn
    setSelectedFile(file);

    // Hiển thị preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto custom-scrollbar">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-green-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {comic ? "Sửa thông tin truyện" : "Thêm truyện mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar relative"
        >
          {/* Overlay khi đang submit */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-gray-900/20 dark:bg-gray-900/40 flex items-center justify-center rounded-xl z-10">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="h-6 w-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {comic
                    ? "Đang cập nhật truyện..."
                    : "Đang thêm truyện mới..."}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <div className="flex flex-col border-2 border-dashed border-green-200 rounded-lg p-6 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Phần xem trước ảnh */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    {previewImage ? (
                      <div className="relative w-full h-64 mb-4">
                        <NextImage
                          src={previewImage}
                          alt="Ảnh bìa truyện"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setSelectedFile(null);
                            setFormData((prev) => ({
                              ...prev,
                              thumbUrl: "",
                            }));
                          }}
                          className="absolute top-2 right-2 bg-gray-800/70 text-white p-1.5 rounded-full hover:bg-gray-900/70 transition-colors cursor-pointer"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-green-500 mb-4 dark:text-green-400 flex items-center justify-center w-full h-64 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <FiImage size={64} />
                      </div>
                    )}
                  </div>

                  {/* Phần tùy chọn tải lên */}
                  <div className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex space-x-4 mb-4">
                        <button
                          type="button"
                          onClick={() => setUploadMethod("file")}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${uploadMethod === "file"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                        >
                          Tải lên từ máy tính
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadMethod("url")}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${uploadMethod === "url"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            }`}
                        >
                          Nhập URL ảnh
                        </button>
                      </div>

                      {uploadMethod === "file" ? (
                        <div className="space-y-4">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                              ? "border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/20"
                              : "border-gray-300 hover:border-green-400 dark:border-gray-600 dark:hover:border-green-500"
                              }`}
                            onClick={handleOpenFileDialog}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            {isUploading ? (
                              <div className="flex flex-col items-center justify-center py-4">
                                <div className="h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <p className="text-gray-600 dark:text-gray-300">
                                  Đang tải lên...
                                </p>
                              </div>
                            ) : (
                              <>
                                <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                                <p className="text-gray-600 dark:text-gray-300 mb-1">
                                  Kéo thả file ảnh vào đây hoặc
                                </p>
                                <p className="text-green-600 font-medium dark:text-green-400">
                                  Nhấn để chọn file
                                </p>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Hỗ trợ định dạng: JPG, PNG, GIF. Kích thước tối đa:
                            2MB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Nhập URL ảnh..."
                              value={imageUrl}
                              onChange={(e) => setImageUrl(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10"
                            />
                            {imageUrl && (
                              <button
                                type="button"
                                onClick={() => setImageUrl("")}
                                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                              >
                                <FiX size={16} />
                              </button>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="default"
                            onClick={handleImageUrlSubmit}
                            disabled={!imageUrl.trim() || isUploading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            <FiCheck className="mr-2" size={16} />
                            Sử dụng URL này
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Tên truyện
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

            <div>
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

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Tác giả
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
              >
                <option value="ONGOING">Đang cập nhật</option>
                <option value="COMPLETED">Đã hoàn thành</option>
                <option value="COMING_SOON">Sắp ra mắt</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Tên gốc
              </label>
              <input
                type="text"
                id="originName"
                name="originName"
                value={formData.originName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Thể loại
              </label>
              {errors.categories && (
                <p className="mb-2 text-sm text-rose-500">
                  {errors.categories}
                </p>
              )}
              <div className="relative category-dropdown-container">
                <div
                  className={`w-full border ${errors.categories ? "border-rose-500" : "border-gray-300"
                    } rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent dark:bg-gray-700 dark:border-gray-600`}
                >
                  <div className="flex flex-wrap gap-2 p-2">
                    {/* Hiển thị các thể loại đã chọn */}
                    {formData.categories.length > 0 &&
                      categories
                        .filter((cat) => formData.categories.includes(cat.id))
                        .map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          >
                            {category.name}
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(category.id)}
                              className="ml-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                            >
                              <FiX size={16} />
                            </button>
                          </span>
                        ))}

                    {/* Input tìm kiếm */}
                    <input
                      type="text"
                      placeholder={
                        formData.categories.length === 0
                          ? "Chọn thể loại..."
                          : ""
                      }
                      className="flex-grow min-w-[120px] p-1 outline-none bg-transparent dark:text-white category-search-input"
                      onFocus={() => setIsCategoryDropdownOpen(true)}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                      value={categorySearchTerm}
                    />
                  </div>
                </div>

                {/* Dropdown danh sách thể loại */}
                {isCategoryDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-800 border border-gray-200 dark:border-gray-700 custom-scrollbar text-white">
                    {categories
                      .filter(
                        (cat) =>
                          cat.name
                            .toLowerCase()
                            .includes(categorySearchTerm.toLowerCase()) &&
                          !formData.categories.includes(cat.id)
                      )
                      .map((category) => (
                        <div
                          key={category.id}
                          className="px-4 py-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20"
                          onClick={() => handleAddCategory(category.id)}
                        >
                          {category.name}
                        </div>
                      ))}
                    {categories.filter(
                      (cat) =>
                        cat.name
                          .toLowerCase()
                          .includes(categorySearchTerm.toLowerCase()) &&
                        !formData.categories.includes(cat.id)
                    ).length === 0 && (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                          Không tìm thấy thể loại phù hợp
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="default"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {comic ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
