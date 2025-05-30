'use client'

import { FiPlus, FiEdit, FiTrash2, FiSearch, FiAlertCircle, FiBookOpen, FiEye } from "react-icons/fi";
import DashboardLayout from "@/components/admin/DashboardLayout";
import Pagination from "@/components/admin/Pagination";
import { useChapter } from "@/hooks/useChapter";
import Image from "next/image";
import { formatDate, constructImageUrl } from "@/utils/helpers";
import ViewChapterModal from "@/components/admin/chapters/ViewChapterModal";
import DeleteChapterModal from "@/components/admin/chapters/DeleteChapterModal";
import ChapterModal from "@/components/admin/chapters/ChapterModal";
import Button from "@/components/ui/Button";

export default function Chapters() {

  const {
    chapters,
    currentPage,
    totalPages,
    isLoading,
    error,
    searchTerm,
    // set
    setCurrentPage,
    setSearchTerm,
    comicFilter,
    comicSearchTerm,
    setComicSearchTerm,
    isComicDropdownOpen,
    setIsComicDropdownOpen,
    handleSelectComic,
    filteredComicOptions,


    // handle
    handleOpenViewModal,
    handleOpenDeleteModal,
    handleOpenAddModal,
    handleOpenEditModal,
    handleSearch,
    handleDeleteChapter,
    handleSubmitChapter,

    // selected
    selectedChapter,

    // comicOptions
    comicOptions,

    // modal
    isViewModalOpen,
    isDeleteModalOpen,
    isAddEditModalOpen,
    setIsViewModalOpen,
    setIsDeleteModalOpen,
    setIsAddEditModalOpen,

    isLoadingComics,
    handleComicDropdownScroll,
  } = useChapter();

  return (
    <DashboardLayout title="Quản lý Chương">
      {/* Search and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm chương..."
              className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <FiSearch className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
            <button type="submit" className="hidden">
              Tìm kiếm
            </button>
          </form>

          {/* Comic Filter */}
          <div className="relative w-full sm:w-80">
            <div
              className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              onClick={() => setIsComicDropdownOpen(!isComicDropdownOpen)}
            >
              <span className="truncate">
                {comicFilter ? comicOptions.find(c => c.id === comicFilter)?.name || "Tất cả truyện" : "Tất cả truyện"}
              </span>
              <svg className={`w-5 h-5 transition-transform ${isComicDropdownOpen ? "transform rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <FiBookOpen className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />

            {isComicDropdownOpen && (
              <div
                className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg max-h-80 overflow-hidden border border-green-100 dark:border-gray-700 flex flex-col"
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

                <div className="overflow-y-auto custom-scrollbar text-white" onScroll={handleComicDropdownScroll}>
                  <div
                    className="px-4 py-2 hover:bg-green-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelectComic("")}
                  >
                    Tất cả truyện
                  </div>

                  {filteredComicOptions.length > 0 ? (
                    filteredComicOptions.map((comic) => (
                      <div
                        key={comic.id}
                        className="px-4 py-2 hover:bg-green-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
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

                  {/* Loading indicator */}
                  {isLoadingComics && (
                    <div className="px-4 py-3 text-center">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Đang tải...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* End Comic Filter */}
        </div>

        <Button
          variant="success"
          onClick={handleOpenAddModal}
          icon={<FiPlus size={18} />}
          size="md"
        >
          <span>Thêm chương mới</span>
        </Button>
      </div>

      {chapters.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center py-12">
            <FiBookOpen className="w-16 h-16 text-gray-300 mb-4 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300">Không có chương nào</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Chưa có chương nào được thêm vào hệ thống.</p>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-600 cursor-pointer"
            >
              <FiPlus size={18} />
              <span>Thêm chương mới</span>
            </button>
          </div>
        </div>
      ) : (
        // Data Table
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-green-100 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 border-b border-green-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Danh sách chương
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50 dark:bg-green-900/30">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Truyện
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Tên chương
                  </th> */}
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Chương
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Ngày tạo
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Ngày cập nhật
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100 dark:divide-gray-700">
                {/* Loading State */}
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-2"></div>
                        <p>Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                        <FiAlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    </td>
                  </tr>
                ) : (chapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm align-middle">
                      <div className="flex items-center justify-center">
                        <div className="flex-shrink-0 h-[120px] w-[100px] relative overflow-hidden">
                          {chapter.detailChapters && chapter.detailChapters.length > 0 && chapter.detailChapters[0]?.imgUrl ? (
                            <Image
                              src={constructImageUrl(chapter, chapter.detailChapters[0].imgUrl)}
                              alt={`Ảnh bìa ${chapter.comicName}`}
                              fill
                              sizes="100px"
                              loading="lazy"
                              className="object-cover rounded-md shadow-sm ring-1 ring-gray-900/5"
                            />
                          ) : (
                            <div className="h-[120px] w-[100px] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center ring-1 ring-gray-900/5">
                              <span className="text-xs text-gray-400 dark:text-gray-500 text-center px-1">
                                No Img
                              </span>
                              <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          <div className="font-medium text-gray-900 dark:text-gray-200 max-w-[150px] truncate">
                            {chapter.comicName}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {chapter.title}
                    </td> */}
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {chapter.chapterNumber}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(chapter.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(chapter.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="info"
                          onClick={() => handleOpenViewModal(chapter)}
                          aria-label="Xem chi tiết"
                          title="Xem chi tiết"
                          icon={<FiEye size={18} />}
                          size="xs"
                        />
                        <Button
                          variant="edit"
                          onClick={() => handleOpenEditModal(chapter)}
                          aria-label="Sửa"
                          title="Sửa"
                          icon={<FiEdit size={18} />}
                          size="xs"
                        />
                        <Button
                          variant="delete"
                          onClick={() => handleOpenDeleteModal(chapter)}
                          aria-label="Xóa"
                          title="Xóa"
                          icon={<FiTrash2 size={18} />}
                          size="xs"
                        />
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && !error && chapters.length > 0 && (
            <div className="p-4 border-t border-green-100 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )
      }


      {/* Modals */}
      <ViewChapterModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        chapter={selectedChapter}
      />

      {selectedChapter && (
        <DeleteChapterModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteChapter}
          chapterTitle={selectedChapter.title}
          chapterNumber={selectedChapter.chapterNumber}
          comicName={selectedChapter.comicName}
        />
      )}

      <ChapterModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSubmit={handleSubmitChapter}
        chapter={selectedChapter}
        comicOptions={comicOptions}
      />
    </DashboardLayout >
  )
}
