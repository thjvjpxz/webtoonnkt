"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CategoryResponse } from "@/types/category";
import { ComicCreateUpdate, ComicResponse } from "@/types/comic";
import { chooseImageUrl, generateSlug } from "@/utils/string";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiCheck, FiImage, FiUpload, FiX } from "react-icons/fi";

interface ComicModalProps {
  comic: ComicResponse | null;
  categories: CategoryResponse[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (comic: ComicCreateUpdate, file?: File) => Promise<void>;
}

export default function ComicModal({
  comic,
  categories,
  isOpen,
  onClose,
  onSave,
}: ComicModalProps) {
  const form = useForm<ComicCreateUpdate>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      author: "",
      status: "ONGOING",
      categories: [],
      thumbUrl: "",
      originName: "",
      isSlugChanged: false,
      isThumbUrlChanged: false,
      isCategoriesChanged: false,
      shouldRemoveThumbUrl: false,
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

  // Lưu trữ giá trị ban đầu để so sánh thay đổi
  const [initialValues, setInitialValues] = useState<{
    slug: string;
    thumbUrl: string;
    categories: string[];
  }>({
    slug: "",
    thumbUrl: "",
    categories: [],
  });

  // Nếu đang sửa, điền dữ liệu vào form
  useEffect(() => {
    if (comic) {
      const formData = {
        name: comic.name || "",
        slug: comic.slug || "",
        description: comic.description || "",
        author: comic.author || "",
        thumbUrl: comic.thumbUrl || "",
        status: comic.status || "ONGOING",
        originName: comic.originName || "",
        categories: comic.categories?.map((cat) => cat.id) || [],
        isSlugChanged: false,
        isThumbUrlChanged: false,
        isCategoriesChanged: false,
        shouldRemoveThumbUrl: false,
      };

      form.reset(formData);
      setPreviewImage(chooseImageUrl(comic.thumbUrl) || "");

      // Nếu có thumbUrl, đặt phương thức tải lên là URL
      if (comic.thumbUrl) {
        setImageUrl(chooseImageUrl(comic.thumbUrl));
        setUploadMethod("url");
      }

      // Lưu giá trị ban đầu
      setInitialValues({
        slug: comic.slug || "",
        thumbUrl: comic.thumbUrl || "",
        categories: comic.categories?.map((cat) => cat.id) || [],
      });
    } else {
      // Reset form khi tạo mới
      form.reset({
        name: "",
        slug: "",
        description: "",
        author: "",
        status: "ONGOING",
        categories: [],
        thumbUrl: "",
        originName: "",
        isSlugChanged: false,
        isThumbUrlChanged: false,
        isCategoriesChanged: false,
        shouldRemoveThumbUrl: false,
      });
      setPreviewImage(null);
      setImageUrl("");
      setSelectedFile(null);
      setUploadMethod("file");

      // Lưu giá trị ban đầu
      setInitialValues({
        slug: "",
        thumbUrl: "",
        categories: [],
      });
    }
  }, [comic, form]);

  // Tự động tạo slug khi thay đổi tên
  const watchName = form.watch("name");
  useEffect(() => {
    if (watchName) {
      const newSlug = generateSlug(watchName);
      form.setValue("slug", newSlug);
    }
  }, [watchName, form]);

  // Xử lý thêm thể loại
  const handleAddCategory = (categoryId: string) => {
    console.log("categoryId", categoryId);
    const currentCategories = form.getValues("categories");
    if (!currentCategories.includes(categoryId)) {
      form.setValue("categories", [...currentCategories, categoryId]);
    }
    setCategorySearchTerm("");
  };

  // Xử lý xóa thể loại
  const handleRemoveCategory = (categoryId: string) => {
    const currentCategories = form.getValues("categories");
    form.setValue(
      "categories",
      currentCategories.filter((id) => id !== categoryId)
    );
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

  // Xử lý lưu
  const handleSubmit = async (data: ComicCreateUpdate) => {
    // Cập nhật data với URL ảnh nếu đang sử dụng phương thức URL
    const dataToSubmit = { ...data };
    if (uploadMethod === "url" && imageUrl.trim()) {
      dataToSubmit.thumbUrl = imageUrl;
    }

    // Chỉ thiết lập các biến check khi đang cập nhật (có comic hiện tại)
    if (comic) {
      // Thiết lập các biến check để theo dõi thay đổi
      const currentThumbUrl = dataToSubmit.thumbUrl || "";
      const currentCategories = dataToSubmit.categories || [];

      dataToSubmit.isSlugChanged = dataToSubmit.slug !== initialValues.slug;
      dataToSubmit.isThumbUrlChanged = currentThumbUrl !== initialValues.thumbUrl;
      dataToSubmit.isCategoriesChanged = JSON.stringify(currentCategories.sort()) !== JSON.stringify(initialValues.categories.sort());

      // Kiểm tra nếu ảnh bìa bị xóa (có ảnh ban đầu nhưng bây giờ không có)
      dataToSubmit.shouldRemoveThumbUrl = initialValues.thumbUrl !== "" && currentThumbUrl === "";

      // Nếu có file được chọn, đánh dấu thumbUrl đã thay đổi
      if (uploadMethod === "file" && selectedFile) {
        dataToSubmit.isThumbUrlChanged = true;
      }
    } else {
      // Khi tạo mới, đặt tất cả biến check về false
      dataToSubmit.isSlugChanged = false;
      dataToSubmit.isThumbUrlChanged = false;
      dataToSubmit.isCategoriesChanged = false;
      dataToSubmit.shouldRemoveThumbUrl = false;
    }

    setIsSubmitting(true);
    setIsUploading(true);
    try {
      // Gọi hàm onSave với dữ liệu và file (nếu có)
      await onSave(
        dataToSubmit,
        uploadMethod === "file" && selectedFile ? selectedFile : undefined
      );
      onClose();
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
    img.onload = () => {
      setPreviewImage(imageUrl);
      form.setValue("thumbUrl", imageUrl);
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

    // Kiểm tra kích thước file (giới hạn 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 10MB");
      return;
    }

    // Lưu file đã chọn
    setSelectedFile(file);

    // Hiển thị preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(chooseImageUrl(e.target?.result as string));
    };
    reader.readAsDataURL(file);
  };

  const selectedCategories = form.watch("categories");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {comic ? "Sửa thông tin truyện" : "Thêm truyện mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Overlay khi đang submit */}
            {isSubmitting && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded z-50">
                <Card className="p-6">
                  <CardContent className="flex items-center space-x-3 p-0">
                    <LoadingSpinner size="md" />
                    <p className="font-medium">
                      {comic
                        ? "Đang cập nhật truyện..."
                        : "Đang thêm truyện mới..."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Phần upload ảnh */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Phần xem trước ảnh */}
                  <div className="flex flex-col items-center justify-center">
                    {previewImage ? (
                      <div className="relative w-full h-64 mb-4">
                        <Image
                          src={chooseImageUrl(previewImage)}
                          alt="Ảnh bìa truyện"
                          fill
                          className="object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setPreviewImage(null);
                            setSelectedFile(null);
                            form.setValue("thumbUrl", "");
                            setImageUrl("");
                          }}
                          className="absolute top-2 right-2"
                        >
                          <FiX size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-64 bg-muted rounded">
                        <FiImage size={64} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Phần tùy chọn tải lên */}
                  <div className="flex flex-col space-y-4">
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant={uploadMethod === "file" ? "default" : "outline"}
                        onClick={() => setUploadMethod("file")}
                        className="flex-1"
                      >
                        Tải lên từ máy tính
                      </Button>
                      <Button
                        type="button"
                        variant={uploadMethod === "url" ? "default" : "outline"}
                        onClick={() => setUploadMethod("url")}
                        className="flex-1"
                      >
                        Nhập URL ảnh
                      </Button>
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
                        <Card
                          className={`border-2 border-dashed cursor-pointer transition-colors ${isDragging
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/50"
                            }`}
                          onClick={handleOpenFileDialog}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <CardContent className="flex flex-col items-center justify-center py-8">
                            {isUploading ? (
                              <div className="flex flex-col items-center space-y-2">
                                <LoadingSpinner size="lg" />
                                <p className="text-muted-foreground">Đang tải lên...</p>
                              </div>
                            ) : (
                              <>
                                <FiUpload className="h-12 w-12 text-muted-foreground mb-3" />
                                <p className="text-muted-foreground mb-1">
                                  Kéo thả file ảnh vào đây hoặc
                                </p>
                                <p className="text-primary font-medium">
                                  Nhấn để chọn file
                                </p>
                              </>
                            )}
                          </CardContent>
                        </Card>
                        <p className="text-xs text-muted-foreground text-center">
                          Hỗ trợ định dạng: JPG, PNG, GIF. Kích thước tối đa: 10MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Input
                          type="text"
                          placeholder="Nhập URL ảnh..."
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={handleImageUrlSubmit}
                          disabled={!imageUrl.trim() || isUploading}
                          className="w-full"
                        >
                          <FiCheck className="mr-2" size={16} />
                          Sử dụng URL này
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Tên truyện không được để trống" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên truyện</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên truyện" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                rules={{ required: "Slug không được để trống" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Slug sẽ tự động tạo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tác giả</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên tác giả" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ONGOING">Đang cập nhật</SelectItem>
                        <SelectItem value="COMPLETED">Đã hoàn thành</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Input {...field} placeholder="Nhập tên gốc" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Nhập mô tả truyện"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categories */}
            <FormField
              control={form.control}
              name="categories"
              rules={{
                validate: (value) =>
                  value.length > 0 || "Vui lòng chọn ít nhất một thể loại"
              }}
              render={() => (
                <FormItem>
                  <FormLabel>Thể loại</FormLabel>
                  <FormControl>
                    <div className="relative category-dropdown-container">
                      <Card className="p-2">
                        <div className="flex flex-wrap gap-2">
                          {/* Hiển thị các thể loại đã chọn */}
                          {selectedCategories.length > 0 &&
                            categories
                              .filter((cat) => selectedCategories.includes(cat.id))
                              .map((category) => (
                                <Badge
                                  key={category.id}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  {category.name}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveCategory(category.id)}
                                    className="h-4 w-4 p-0 hover:bg-transparent"
                                  >
                                    <FiX size={12} />
                                  </Button>
                                </Badge>
                              ))}

                          {/* Input tìm kiếm */}
                          <Input
                            type="text"
                            placeholder={
                              selectedCategories.length === 0
                                ? "Chọn thể loại..."
                                : "Thêm thể loại..."
                            }
                            className="flex-1 min-w-[120px] border-0 shadow-none p-1 h-8 focus-visible:ring-0 category-search-input"
                            onFocus={() => setIsCategoryDropdownOpen(true)}
                            onChange={(e) => setCategorySearchTerm(e.target.value)}
                            value={categorySearchTerm}
                          />
                        </div>
                      </Card>

                      {/* Dropdown danh sách thể loại */}
                      {isCategoryDropdownOpen && (
                        <Card className="absolute z-50 mt-1 w-full max-h-60 overflow-auto">
                          <CardContent className="p-1">
                            {categories
                              .filter(
                                (cat) =>
                                  cat.name
                                    .toLowerCase()
                                    .includes(categorySearchTerm.toLowerCase()) &&
                                  !selectedCategories.includes(cat.id)
                              )
                              .map((category) => (
                                <button
                                  key={category.id}
                                  className="px-3 py-2 cursor-pointer hover:bg-accent rounded transition-colors flex w-full"
                                  onClick={() => handleAddCategory(category.id)}
                                >
                                  {category.name}
                                </button>
                              ))
                            }
                            {
                              categories.filter(
                                (cat) =>
                                  cat.name
                                    .toLowerCase()
                                    .includes(categorySearchTerm.toLowerCase()) &&
                                  !selectedCategories.includes(cat.id)
                              ).length === 0 && (
                                <div className="px-3 py-2 text-muted-foreground text-sm">
                                  Không tìm thấy thể loại phù hợp
                                </div>
                              )
                            }
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {comic ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
