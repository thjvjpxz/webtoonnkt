"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CategoryResponse } from "@/types/category";
import { PublisherComicRequest, PublisherComicResponse } from "@/types/publisher";
import { generateSlug } from "@/utils/string";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiCheck, FiImage, FiUpload, FiX } from "react-icons/fi";

interface PublisherComicModalProps {
  comic: PublisherComicResponse | null;
  categories: CategoryResponse[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (comic: PublisherComicRequest, file?: File) => Promise<void>;
}

export default function PublisherComicModal({
  comic,
  categories,
  isOpen,
  onClose,
  onSave,
}: PublisherComicModalProps) {
  const form = useForm<PublisherComicRequest>({
    defaultValues: {
      name: "",
      originName: "",
      author: "",
      description: "",
      thumbUrl: "",
      categoryIds: [],
    },
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
      const formData = {
        name: comic.name || "",
        originName: comic.originName || "",
        author: comic.author || "",
        description: comic.description || "",
        thumbUrl: comic.thumbUrl || "",
        categoryIds: comic.categories?.map((cat) => cat.id) || [],
      };

      form.reset(formData);
      setPreviewImage(comic.thumbUrl || "");

      // Nếu có thumbUrl, đặt phương thức tải lên là URL
      if (comic.thumbUrl) {
        setImageUrl(comic.thumbUrl);
        setUploadMethod("url");
      }
    } else {
      // Reset form khi tạo mới
      form.reset({
        name: "",
        originName: "",
        author: "",
        description: "",
        thumbUrl: "",
        categoryIds: [],
      });
      setPreviewImage(null);
      setImageUrl("");
      setSelectedFile(null);
      setUploadMethod("file");
    }
  }, [comic, form]);

  // Xử lý thêm thể loại
  const handleAddCategory = (categoryId: string) => {
    const currentCategories = form.getValues("categoryIds");
    if (!currentCategories.includes(categoryId)) {
      form.setValue("categoryIds", [...currentCategories, categoryId]);
    }
    setCategorySearchTerm("");
    setIsCategoryDropdownOpen(false);
  };

  // Xử lý xóa thể loại
  const handleRemoveCategory = (categoryId: string) => {
    const currentCategories = form.getValues("categoryIds");
    form.setValue(
      "categoryIds",
      currentCategories.filter((id) => id !== categoryId)
    );
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".category-dropdown-container") && isCategoryDropdownOpen) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  // Xử lý tải lên ảnh bìa
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileUpload(file);
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh!");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Mở hộp thoại chọn file
  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Xử lý URL ảnh
  const handleImageUrlSubmit = () => {
    if (imageUrl.trim()) {
      setPreviewImage(imageUrl);
      setSelectedFile(null);
    }
  };

  // Xử lý drag & drop
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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Xử lý lưu
  const handleSubmit = async (data: PublisherComicRequest) => {
    const dataToSubmit = { ...data };
    if (uploadMethod === "url" && imageUrl.trim()) {
      dataToSubmit.thumbUrl = imageUrl;
    }

    setIsSubmitting(true);
    setIsUploading(true);
    try {
      await onSave(
        dataToSubmit,
        uploadMethod === "file" && selectedFile ? selectedFile : undefined
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  // Lọc thể loại theo từ khóa tìm kiếm
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  // Lấy thể loại đã chọn
  const selectedCategoryIds = form.watch("categoryIds") || [];
  const selectedCategories = categories.filter((cat) =>
    selectedCategoryIds.includes(cat.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {comic ? "Chỉnh sửa truyện" : "Thêm truyện mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cột trái - Thông tin cơ bản */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Tên truyện không được để trống" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên truyện *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên truyện..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên gốc</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên gốc (tiếng Anh, Nhật...)..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="author"
                  rules={{ required: "Tác giả không được để trống" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tác giả *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên tác giả..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả truyện..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Thể loại */}
                <div className="space-y-2">
                  <FormLabel>Thể loại *</FormLabel>

                  {/* Thể loại đã chọn */}
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedCategories.map((category) => (
                        <Badge key={category.id} variant="secondary" className="flex items-center gap-1">
                          {category.name}
                          <FiX
                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                            onClick={() => handleRemoveCategory(category.id)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Input tìm kiếm thể loại */}
                  <div className="category-dropdown-container relative">
                    <Input
                      placeholder="Tìm kiếm và thêm thể loại..."
                      value={categorySearchTerm}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                      onFocus={() => setIsCategoryDropdownOpen(true)}
                    />

                    {/* Dropdown thể loại */}
                    {isCategoryDropdownOpen && (
                      <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto">
                        <CardContent className="p-2">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                              <div
                                key={category.id}
                                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                                onClick={() => handleAddCategory(category.id)}
                              >
                                <span>{category.name}</span>
                                {selectedCategoryIds.includes(category.id) && (
                                  <FiCheck className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-gray-500 text-sm">
                              Không tìm thấy thể loại nào
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {selectedCategoryIds.length === 0 && (
                    <p className="text-sm text-red-500">Vui lòng chọn ít nhất một thể loại</p>
                  )}
                </div>
              </div>

              {/* Cột phải - Ảnh bìa */}
              <div className="space-y-4">
                <div>
                  <FormLabel>Ảnh bìa</FormLabel>

                  {/* Toggle upload method */}
                  <div className="flex gap-2 mt-2 mb-4">
                    <Button
                      type="button"
                      size="sm"
                      variant={uploadMethod === "file" ? "default" : "outline"}
                      onClick={() => setUploadMethod("file")}
                    >
                      <FiUpload className="w-4 h-4 mr-2" />
                      Tải file
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={uploadMethod === "url" ? "default" : "outline"}
                      onClick={() => setUploadMethod("url")}
                    >
                      <FiImage className="w-4 h-4 mr-2" />
                      URL ảnh
                    </Button>
                  </div>

                  {uploadMethod === "file" ? (
                    <div className="space-y-4">
                      {/* Upload area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                          }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <FiUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">
                          Kéo thả ảnh vào đây hoặc
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleOpenFileDialog}
                        >
                          Chọn file
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập URL ảnh..."
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleImageUrlSubmit}
                        >
                          Xem trước
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Preview ảnh */}
                  {previewImage && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Xem trước:</p>
                      <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                        <NextImage
                          src={previewImage}
                          alt="Preview"
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setPreviewImage(null);
                            setSelectedFile(null);
                            setImageUrl("");
                          }}
                        >
                          <FiX className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || selectedCategoryIds.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isUploading ? "Đang tải lên..." : "Đang lưu..."}
                  </>
                ) : (
                  comic ? "Cập nhật" : "Thêm mới"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 