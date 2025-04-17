import { ChapterModalProps } from "@/types/chapter";
import { FiPlus, FiUpload, FiX, FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { useChapterModal } from "@/hooks/useChapterModal";
import { ChapterStatus } from "@/types/chapter";

export default function ChapterModal({
  isOpen,
  onClose,
  onSubmit,
  chapter,
  comicOptions
}: ChapterModalProps) {
  const {
    // States
    title,
    chapterNumber,
    comicId,
    previewUrls,
    isUploading,
    dropTargetIndex,
    status,
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

    // Handlers
    handleSelectComic,
    handleImageChange,
    handleRemoveImage,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleSubmit,
    handleComicDropdownScroll,

    // Utils
    isEditMode,
    uploadMethod,
    imageLink,
    setUploadMethod,
    setImageLink,
    hasValidImageLinks,
    handleAddMultipleImageLinks
  } = useChapterModal(isOpen, chapter || null, comicOptions, onSubmit);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 p-4">
      <div className="relative max-w-4xl w-full bg-white rounded-lg shadow-xl dark:bg-gray-800 max-h-[90vh] overflow-y-auto dark:border-gray-700 border custom-scrollbar">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {isEditMode ? "Chỉnh sửa chương" : "Thêm chương mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Truyện */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Truyện <span className="text-red-500">*</span>
                </label>
                <div className="relative w-full">
                  <div
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center cursor-pointer"
                    onClick={() => setIsComicDropdownOpen(!isComicDropdownOpen)}
                  >
                    <span className="truncate">
                      {comicId ? comicOptions.find(c => c.id === comicId)?.name || "Chọn truyện" : "Chọn truyện"}
                    </span>
                    <svg className={`w-5 h-5 transition-transform ${isComicDropdownOpen ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>

                  {isComicDropdownOpen && (
                    <div
                      className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg max-h-60 overflow-auto border border-green-100 dark:border-gray-700 flex flex-col custom-scrollbar"
                      onScroll={handleComicDropdownScroll}
                    >
                      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 p-2 border-b border-green-100 dark:border-gray-700 shadow-sm">
                        <div className="relative">
                          <input
                            type="text"
                            value={comicSearchTerm}
                            onChange={(e) => setComicSearchTerm(e.target.value)}
                            placeholder="Tìm truyện..."
                            className="pl-8 pr-4 py-2 w-full border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <FiSearch className="h-4 w-4 text-green-400 absolute left-2.5 top-3 dark:text-green-500" />
                        </div>
                      </div>

                      {filteredComicOptions.length > 0 ? (
                        filteredComicOptions.map((comic) => (
                          <div
                            key={comic.id}
                            className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                            onClick={() => handleSelectComic(comic.id)}
                          >
                            <div className="h-10 w-8 flex-shrink-0 overflow-hidden rounded">
                              {comic.thumbUrl ? (
                                <div className="relative h-10 w-8">
                                  <Image
                                    src={comic.thumbUrl}
                                    alt={comic.name}
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <span className="truncate">{comic.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                          Không tìm thấy truyện nào
                        </div>
                      )}

                      {isLoadingComics && (
                        <div className="px-4 py-3 text-center">
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Đang tải...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Số chương */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Số chương <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(e.target.value)}
                  required
                  min="0"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Nhập số chương (ví dụ: 1, 1.5, 2,...)"
                />
              </div>

              {/* Tiêu đề chương */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tiêu đề chương <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Nhập tiêu đề chương"
                />
              </div>

              {/* Trạng thái */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  value={status.toString()}
                  onChange={(e) => setStatus(Number(e.target.value) as ChapterStatus)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value={ChapterStatus.FREE}>Miễn phí</option>
                  <option value={ChapterStatus.FEE}>Trả phí</option>
                  <option value={ChapterStatus.VIP}>VIP</option>
                </select>
              </div>

              {/* Upload ảnh */}
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Thêm hình ảnh <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('file')}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${uploadMethod === 'file'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Tải ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('link')}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${uploadMethod === 'link'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      Nhập link
                    </button>
                  </div>
                </div>

                {uploadMethod === 'file' ? (
                  <>
                    {previewUrls.length === 0 && (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
                        <div className="flex flex-col items-center justify-center py-6">
                          <FiUpload className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-1">
                            Kéo và thả ảnh vào đây hoặc nhấn để chọn
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
                            Hỗ trợ JPG, PNG, WEBP
                          </p>
                          <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={previewUrls.length >= 20}
                            />
                            Chọn ảnh
                          </label>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mb-4">
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex-1">
                        <textarea
                          value={imageLink}
                          onChange={(e) => setImageLink(e.target.value)}
                          placeholder="Nhập link ảnh, mỗi link một dòng (https://...)"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[80px]"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddMultipleImageLinks}
                          disabled={!hasValidImageLinks(imageLink)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <FiPlus size={16} />
                          <span>Thêm các link</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Hỗ trợ nhập nhiều link ảnh, mỗi link trên một dòng
                    </p>
                  </div>
                )}

                {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ảnh đã chọn ({previewUrls.length}): <span className="text-xs text-green-500 ml-1">(Kéo thả để sắp xếp)</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          className={`relative group cursor-move border-2 transition-all duration-200 ${index === dropTargetIndex ? 'border-green-400 dark:border-green-500 rounded-md' : 'border-transparent'
                            }`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="relative w-full pt-[150%] rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                              src={url}
                              alt={`Preview ${index}`}
                              fill
                              sizes="100%"
                              className="object-cover absolute inset-0"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-70 hover:opacity-100 shadow-sm cursor-pointer"
                          >
                            <FiX size={16} />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-70">
                            Ảnh {index + 1}
                          </div>
                        </div>
                      ))}
                      {/* Nút thêm ảnh */}
                      {previewUrls.length < 20 && (
                        <label className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer aspect-w-2 aspect-h-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="flex flex-col items-center p-4">
                            <FiPlus size={24} className="text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">Thêm ảnh</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </div>
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isUploading || isSubmitting || !title || !chapterNumber || !comicId || !status || (previewUrls.length === 0 && !isEditMode)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {isUploading || isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>{isUploading ? "Đang xử lý..." : isEditMode ? "Đang cập nhật..." : "Đang thêm mới..."}</span>
                </>
              ) : (
                <span>{isEditMode ? "Cập nhật" : "Thêm mới"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 