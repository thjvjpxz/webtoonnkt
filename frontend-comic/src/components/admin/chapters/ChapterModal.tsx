import { useChapterModal } from "@/hooks/useChapterModal";
import { Chapter, ChapterCreateUpdate, ChapterStatus } from "@/types/chapter";
import { ComicResponse } from "@/types/comic";
import Image from "next/image";
import { useRef } from "react";
import { FiLoader, FiPlus, FiSearch, FiUpload, FiX } from "react-icons/fi";

// Shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { chooseImageUrl } from "@/utils/string";

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (chapterData: ChapterCreateUpdate, images: File[]) => void;
  chapter?: Chapter | null;
}

export default function ChapterModal({
  isOpen,
  onClose,
  onSubmit,
  chapter,
}: ChapterModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    // States
    title,
    chapterNumber,
    comicId,
    previewUrls,
    isUploading,
    status,
    price,
    isSubmitting,

    // Comic dropdown related
    comicSearchTerm,
    isComicDropdownOpen,
    isLoadingComics,
    filteredComicOptions,

    // Setters
    setTitle,
    setChapterNumber,
    setComicSearchTerm,
    setIsComicDropdownOpen,
    setStatus,
    setPrice,

    // Handlers
    handleSelectComic,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
    handleComicDropdownScroll,

    // Utils
    isEditMode,
    uploadMethod,
    imageLink,
    setUploadMethod,
    setImageLink
  } = useChapterModal(isOpen, chapter || null, onSubmit);

  // Xử lý kéo thả ảnh
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      // Tạo FileList từ array
      const fileList = new DataTransfer();
      imageFiles.forEach(file => fileList.items.add(file));

      // Tạo event giả để sử dụng handleImageChange
      const mockEvent = {
        target: {
          files: fileList.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      handleImageChange(mockEvent);
    }
  };

  // Xử lý click nút chọn ảnh
  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditMode ? "Chỉnh sửa chương" : "Thêm chương mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Truyện */}
            <div className="col-span-2 md:col-span-1">
              <Label className="block text-sm font-medium text-foreground mb-1">
                Truyện <span className="text-destructive">*</span>
              </Label>
              <div className="relative w-full">
                <Input
                  type="text"
                  value={comicId ? filteredComicOptions.find((c: ComicResponse) => c.id === comicId)?.name || "Chọn truyện" : "Chọn truyện"}
                  placeholder="Chọn truyện..."
                  className="pl-10 pr-10 w-full border-border focus:border-primary cursor-pointer"
                  onClick={() => setIsComicDropdownOpen(!isComicDropdownOpen)}
                  readOnly
                />
                <FiSearch className="h-5 w-5 text-primary absolute left-3 top-2" />
                <svg
                  className={`w-5 h-5 transition-transform text-muted-foreground absolute right-3 top-2 ${isComicDropdownOpen ? "transform rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>

                {isComicDropdownOpen && (
                  <div
                    className="absolute z-10 mt-1 w-full bg-card shadow-strong rounded-lg max-h-60 overflow-hidden border border-border/50 flex flex-col backdrop-blur-sm"
                    onScroll={handleComicDropdownScroll}
                  >
                    <div className="sticky top-0 z-20 bg-card p-2 border-b border-border/50 shadow-soft">
                      <div className="relative">
                        <Input
                          value={comicSearchTerm}
                          onChange={(e) => setComicSearchTerm(e.target.value)}
                          placeholder="Tìm truyện..."
                          className="pl-8 border-border focus:border-primary"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <FiSearch className="h-4 w-4 text-primary absolute left-2.5 top-3" />
                      </div>
                    </div>

                    <div className="overflow-y-auto custom-scrollbar">
                      {filteredComicOptions.length > 0 ? (
                        filteredComicOptions.map((comic) => (
                          <div
                            key={comic.id}
                            className="px-4 py-2 hover:bg-muted/50 cursor-pointer flex items-center gap-3 text-foreground transition-colors duration-200"
                            onClick={() => handleSelectComic(comic.id)}
                          >
                            <div className="h-10 w-8 flex-shrink-0 overflow-hidden rounded">
                              {comic.thumbUrl ? (
                                <div className="relative h-10 w-8">
                                  <Image
                                    src={chooseImageUrl(comic.thumbUrl)}
                                    alt={comic.name}
                                    fill
                                    sizes="32px"
                                    className="object-cover shadow-soft border border-border/30"
                                    loading="lazy"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-8 bg-muted rounded flex items-center justify-center">
                                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <span className="truncate">{comic.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-muted-foreground">
                          Không tìm thấy truyện nào
                        </div>
                      )}

                      {isLoadingComics && (
                        <div className="px-4 py-3 text-center">
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                          <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Số chapter */}
            <div className="col-span-2 md:col-span-1">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số chương <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(e.target.value)}
                required
                min="0"
                step="0.1"
                placeholder="Nhập số chapter (ví dụ: 1, 1.5, 2,...)"
              />
            </div>

            {/* Tiêu đề chapter */}
            <div className="col-span-2">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tiêu đề chương <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Nhập tiêu đề chương"
              />
            </div>

            {/* Trạng thái */}
            <div className="col-span-2 md:col-span-1">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Trạng thái <span className="text-red-500">*</span>
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ChapterStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ChapterStatus.FREE}>Miễn phí</SelectItem>
                  <SelectItem value={ChapterStatus.FEE}>Trả phí</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Giá */}
            {status === ChapterStatus.FEE && (
              <div className="col-span-2 md:col-span-1">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giá {status === ChapterStatus.FEE && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  step="0.01"
                  placeholder="Nhập giá (Linh thạch)"
                />
              </div>
            )}

            {/* Upload ảnh */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Thêm hình ảnh <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {uploadMethod === 'file'
                      ? 'Chế độ tải ảnh từ máy tính. Chuyển sang "Nhập link" để dùng URL.'
                      : 'Chế độ nhập link ảnh. Chuyển sang "Tải ảnh" để upload từ máy tính.'
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={uploadMethod === 'file' ? 'default' : 'secondary'}
                    onClick={() => setUploadMethod('file')}
                    size="sm"
                  >
                    Tải ảnh
                  </Button>
                  <Button
                    type="button"
                    variant={uploadMethod === 'link' ? 'default' : 'secondary'}
                    onClick={() => setUploadMethod('link')}
                    size="sm"
                  >
                    Nhập link
                  </Button>
                </div>
              </div>

              {uploadMethod === 'file' ? (
                <>
                  {/* Input file ẩn luôn tồn tại để nút "Thêm ảnh" có thể hoạt động */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {previewUrls.length === 0 && (
                    <div
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4 hover:border-primary transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center py-6">
                        <FiUpload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-1">
                          Kéo và thả ảnh vào đây hoặc nhấn để chọn
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
                          Hỗ trợ JPG, PNG, WEBP
                        </p>
                        <Button
                          type="button"
                          variant="default"
                          onClick={handleChooseImage}
                        >
                          Chọn ảnh
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-4">
                  <Textarea
                    value={imageLink}
                    onChange={(e) => setImageLink(e.target.value)}
                    placeholder="Nhập link ảnh, mỗi link một dòng (https://...). Ảnh sẽ tự động hiển thị khi bạn dán link hợp lệ"
                    className="min-h-[100px]"
                    rows={4}
                  />
                </div>
              )}

              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ảnh đã chọn ({previewUrls.length}):
                    <span className="text-xs text-blue-500 ml-1">
                      {uploadMethod === 'file'
                        ? '(Tự động sắp xếp theo tên file)'
                        : '(Từ URL đã nhập)'
                      }
                    </span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative group border-2 border-transparent transition-all duration-200"
                      >
                        <div className="relative w-full pt-[150%] rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                          <Image
                            src={chooseImageUrl(url)}
                            alt={`Preview ${index}`}
                            fill
                            sizes="100%"
                            className="object-cover absolute inset-0"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full opacity-70 hover:opacity-100"
                        >
                          <FiX size={16} />
                        </Button>
                        <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-70">
                          Ảnh {index + 1}
                        </div>
                      </div>
                    ))}
                    {/* Nút thêm ảnh */}
                    {uploadMethod === 'file' && previewUrls.length < 20 && (
                      <div
                        className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer aspect-w-2 aspect-h-3 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary transition-colors"
                        onClick={handleChooseImage}
                        style={{ aspectRatio: '2/3' }}
                      >
                        <div className="flex flex-col items-center p-4">
                          <FiPlus size={24} className="text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">Thêm ảnh</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={
                isUploading ||
                isSubmitting ||
                !title ||
                !chapterNumber ||
                !comicId ||
                !status ||
                (status === ChapterStatus.FEE && (!price || price <= 0)) ||
                (previewUrls.length === 0 && !isEditMode)
              }
              variant="default"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isUploading && <FiLoader className="animate-spin ml-2" />}
              {isEditMode ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
