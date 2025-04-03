"use client";

import { ChapterCreateUpdate, ChapterResponse, ComicResponse } from "@/types/api";
import { FC, useEffect, useRef, useState } from "react";
import { FiUpload, FiX, FiPlus, FiImage, FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Image from "next/image";

type ChapterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChapterCreateUpdate, files: File[]) => void;
  chapter?: ChapterResponse | null;
  comics: ComicResponse[];
};

const ChapterModal: FC<ChapterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  chapter,
  comics,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const comicDropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ChapterCreateUpdate>({
    title: "",
    status: "FREE",
    chapterNumber: 0,
    comicId: "",
    detailChapters: [],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    title: "",
    comicId: "",
    chapterNumber: "",
    images: "",
  });

  // State cho dropdown chọn truyện
  const [comicSearchTerm, setComicSearchTerm] = useState("");
  const [isComicDropdownOpen, setIsComicDropdownOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState<ComicResponse | null>(null);

  // Lọc danh sách truyện dựa trên từ khóa tìm kiếm
  const filteredComics = comics.filter((comic) =>
    comic.name.toLowerCase().includes(comicSearchTerm.toLowerCase())
  );

  // Reset form khi mở modal
  useEffect(() => {
    if (isOpen) {
      if (!chapter) {
        // Thêm mới
        setFormData({
          title: "",
          status: "FREE",
          chapterNumber: 0,
          comicId: "",
          detailChapters: [],
        });
        setFiles([]);
        setPreviewImages([]);
        setSelectedComic(null);
        setComicSearchTerm("");
      } else {
        // Cập nhật
        setFormData({
          title: chapter.title,
          status: chapter.status,
          chapterNumber: chapter.chapterNumber,
          comicId: chapter.comicId.toString(),
          detailChapters: chapter.detailChapters.map((detail) => ({
            imgUrl: detail.imgUrl,
            orderNumber: detail.orderNumber,
          })),
        });
        setPreviewImages(chapter.detailChapters.map((detail) => detail.imgUrl));
        setFiles([]);
        // Tìm và đặt truyện đã chọn
        const comic = comics.find((c) => c.id.toString() === chapter.comicId.toString());
        setSelectedComic(comic || null);
        setComicSearchTerm("");
      }
    }
  }, [isOpen, chapter, comics]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comicDropdownRef.current && !comicDropdownRef.current.contains(event.target as Node)) {
        setIsComicDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "chapterNumber" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectComic = (comic: ComicResponse) => {
    setSelectedComic(comic);
    setFormData((prev) => ({
      ...prev,
      comicId: comic.id.toString(),
    }));
    setIsComicDropdownOpen(false);
    setComicSearchTerm("");
    // Xóa lỗi nếu có
    if (errors.comicId) {
      setErrors((prev) => ({
        ...prev,
        comicId: "",
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles = Array.from(selectedFiles);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Tạo URL preview cho các file mới
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 0);
      return newFiles;
    });

    setPreviewImages((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      // Trước khi xóa URL, hủy để tránh rò rỉ bộ nhớ
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return; // Đã ở trên cùng

    // Di chuyển ảnh preview
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      [newPreviews[index - 1], newPreviews[index]] = [
        newPreviews[index],
        newPreviews[index - 1],
      ];
      return newPreviews;
    });

    // Di chuyển files (nếu có)
    setFiles((prev) => {
      if (prev.length <= index) return prev;
      const newFiles = [...prev];
      [newFiles[index - 1], newFiles[index]] = [
        newFiles[index],
        newFiles[index - 1],
      ];
      return newFiles;
    });
  };

  const moveDown = (index: number) => {
    if (index === previewImages.length - 1) return; // Đã ở dưới cùng

    // Di chuyển ảnh preview
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      [newPreviews[index], newPreviews[index + 1]] = [
        newPreviews[index + 1],
        newPreviews[index],
      ];
      return newPreviews;
    });

    // Di chuyển files (nếu có)
    setFiles((prev) => {
      if (prev.length <= index + 1) return prev;
      const newFiles = [...prev];
      [newFiles[index], newFiles[index + 1]] = [
        newFiles[index + 1],
        newFiles[index],
      ];
      return newFiles;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    let valid = true;
    const newErrors = {
      title: "",
      comicId: "",
      chapterNumber: "",
      images: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề chapter";
      valid = false;
    }

    if (!formData.comicId) {
      newErrors.comicId = "Vui lòng chọn truyện";
      valid = false;
    }

    if (formData.chapterNumber < 0) {
      newErrors.chapterNumber = "Số chapter không được nhỏ hơn 0";
      valid = false;
    }

    if (previewImages.length === 0) {
      newErrors.images = "Vui lòng tải lên ít nhất một ảnh";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    // Chuẩn bị dữ liệu chi tiết chapter
    const detailChapters = previewImages.map((url, index) => ({
      imgUrl: url,
      orderNumber: index,
    }));

    // Gửi dữ liệu
    const finalFormData: ChapterCreateUpdate = {
      ...formData,
      detailChapters,
    };

    onSubmit(finalFormData, files);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-green-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {chapter ? "Cập nhật chapter" : "Thêm chapter mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="comicId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Truyện <span className="text-rose-500">*</span>
                </label>
                <div ref={comicDropdownRef} className="relative">
                  <div
                    onClick={() => setIsComicDropdownOpen(!isComicDropdownOpen)}
                    className={`flex items-center justify-between w-full px-3 py-2 border ${errors.comicId
                      ? "border-rose-500"
                      : "border-gray-300 dark:border-gray-600"
                      } rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  >
                    <span className={selectedComic ? "" : "text-gray-400 dark:text-gray-500"}>
                      {selectedComic ? selectedComic.name : "Chọn truyện"}
                    </span>
                    {isComicDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                  </div>

                  {isComicDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                          <input
                            type="text"
                            value={comicSearchTerm}
                            onChange={(e) => setComicSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm truyện..."
                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                          />
                          <FiSearch className="absolute left-2.5 top-2 text-gray-400 dark:text-gray-500" size={16} />
                        </div>
                      </div>

                      {filteredComics.length > 0 ? (
                        <ul className="py-1">
                          {filteredComics.map((comic) => (
                            <li
                              key={comic.id}
                              onClick={() => handleSelectComic(comic)}
                              className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-700 cursor-pointer"
                            >
                              <div className="flex items-center">
                                {comic.thumbUrl && (
                                  <div className="h-8 w-6 flex-shrink-0 mr-2 relative">
                                    <Image
                                      src={comic.thumbUrl}
                                      alt={comic.name}
                                      fill
                                      sizes="24px"
                                      className="object-cover rounded"
                                    />
                                  </div>
                                )}
                                <span>{comic.name}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                          Không tìm thấy truyện
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {errors.comicId && (
                  <p className="mt-1 text-xs text-rose-500">{errors.comicId}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tiêu đề chapter <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.title
                    ? "border-rose-500"
                    : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200`}
                  placeholder="Nhập tiêu đề chapter"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-500">{errors.title}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="chapterNumber"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Số chapter <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  id="chapterNumber"
                  name="chapterNumber"
                  min="0"
                  value={formData.chapterNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.chapterNumber
                    ? "border-rose-500"
                    : "border-gray-300 dark:border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200`}
                  placeholder="Nhập số chapter"
                />
                {errors.chapterNumber && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.chapterNumber}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Trạng thái
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                >
                  <option value="FREE">Miễn phí (FREE)</option>
                  <option value="FEE">Trả phí (FEE)</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ảnh chapter <span className="text-rose-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 rounded-md text-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Nhấp để tải lên ảnh chapter
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    (JPG, PNG, GIF)
                  </p>
                </div>
                {errors.images && (
                  <p className="mt-1 text-xs text-rose-500">{errors.images}</p>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Danh sách ảnh ({previewImages.length})
                </p>
                {previewImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2">
                    {previewImages.map((src, index) => (
                      <div
                        key={index}
                        className="relative border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden group"
                      >
                        <div className="aspect-w-2 aspect-h-3 relative">
                          <Image
                            src={src}
                            alt={`Preview ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className={`p-1 ${index === 0
                              ? "bg-gray-400"
                              : "bg-blue-500 hover:bg-blue-600"
                              } text-white rounded-full`}
                            title="Di chuyển lên"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveDown(index)}
                            disabled={index === previewImages.length - 1}
                            className={`p-1 ${index === previewImages.length - 1
                              ? "bg-gray-400"
                              : "bg-blue-500 hover:bg-blue-600"
                              } text-white rounded-full`}
                            title="Di chuyển xuống"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full"
                            title="Xóa ảnh"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="absolute top-0 left-0 bg-black/60 text-white px-2 py-1 text-xs">
                          Thứ tự: {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-md">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Chưa có ảnh nào
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              {chapter ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChapterModal; 