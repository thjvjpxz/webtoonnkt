"use client";

import { useCrawler } from "@/hooks/useCrawler";
import { CrawlerStatus } from "@/types/crawler";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FiCheckCircle, FiAlertCircle, FiPlay, FiInfo, FiSettings, FiStopCircle } from "react-icons/fi";
import { formatDate } from "@/utils/helpers";

export default function CrawlerPage() {
    const {
        isConnected,
        isLoading,
        options,
        progress,
        lastCompletedChapter,
        updateOptions,
        startCrawling,
        stopCrawling,
        calculateProgress
    } = useCrawler();

    // Dịch trạng thái sang tiếng Việt
    const getStatusText = () => {
        if (!progress) return "Chưa bắt đầu";

        switch (progress.status) {
            case CrawlerStatus.STARTED:
                return "Đã bắt đầu";
            case CrawlerStatus.IN_PROGRESS:
                return "Đang tiến hành";
            case CrawlerStatus.COMPLETED:
                return "Đã hoàn thành";
            case CrawlerStatus.ERROR:
                return "Lỗi";
            default:
                return "Không xác định";
        }
    };

    // Lấy màu dựa vào trạng thái
    const getStatusColor = () => {
        if (!progress) return "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400";

        switch (progress.status) {
            case CrawlerStatus.STARTED:
                return "bg-blue-500";
            case CrawlerStatus.IN_PROGRESS:
                return "bg-amber-500";
            case CrawlerStatus.COMPLETED:
                return "bg-emerald-500";
            case CrawlerStatus.ERROR:
                return "bg-red-500";
            default:
                return "bg-gray-200 dark:bg-gray-700";
        }
    };

    return (
        <DashboardLayout title="Crawler">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-gray-600">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                        <FiSettings className="inline mr-2 text-green-600" />
                        Cấu hình Crawler
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Trang bắt đầu
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={options.startPage}
                                onChange={(e) => updateOptions({ startPage: parseInt(e.target.value) || 1 })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Trang kết thúc
                            </label>
                            <input
                                type="number"
                                min={options.startPage}
                                value={options.endPage}
                                onChange={(e) => updateOptions({ endPage: parseInt(e.target.value) || options.startPage })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        <div className="hidden items-center">
                            <input
                                type="checkbox"
                                id="saveDrive"
                                checked={options.saveDrive}
                                onChange={(e) => updateOptions({ saveDrive: e.target.checked })}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="saveDrive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Lưu trữ trên Drive
                            </label>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={startCrawling}
                                disabled={isLoading || (progress?.status === CrawlerStatus.IN_PROGRESS)}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiPlay className="mr-2" />
                                {isLoading ? "Đang khởi tạo..." : "Bắt đầu Crawl"}
                            </button>

                            <button
                                onClick={stopCrawling}
                                disabled={!isConnected || progress?.status !== CrawlerStatus.IN_PROGRESS}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiStopCircle className="mr-2" />
                                Dừng Crawl
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-gray-600">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                        <FiInfo className="inline mr-2 text-green-600" />
                        Trạng thái Crawler
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kết nối:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isConnected ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                                }`}>
                                {isConnected ? (
                                    <>
                                        <FiCheckCircle className="mr-1" />
                                        Đã kết nối
                                    </>
                                ) : (
                                    <>
                                        <FiAlertCircle className="mr-1" />
                                        Chưa kết nối
                                    </>
                                )}
                            </span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()} bg-opacity-20 text-opacity-100`}>
                                {getStatusText()}
                            </span>
                        </div>

                        {progress && (
                            <>
                                {progress.currentPage && progress.totalPages && (
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            <span>Trang {progress.currentPage}</span>
                                            <span>
                                                {calculateProgress(progress.currentPage, progress.totalPages, options.startPage, options.endPage)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className="bg-green-600 h-2.5 rounded-full"
                                                style={{
                                                    width: `${calculateProgress(progress.currentPage, progress.totalPages, options.startPage, options.endPage)}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Truyện đã xử lý</p>
                                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{progress.totalComicsProcessed || 0}</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Truyện thành công</p>
                                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{progress.totalSuccessfulComics || 0}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                    <FiInfo className="inline mr-2 text-green-600" />
                    Chi tiết tiến trình
                </h2>

                {progress?.currentComic && (
                    <div className="mb-4 p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white">Đang xử lý truyện:</h3>
                        <p className="text-xl font-semibold text-green-600 dark:text-green-400">{progress.currentComic}</p>
                        {progress.currentComicChaptersProcessed !== undefined && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">Chapter đã xử lý: {progress.currentComicChaptersProcessed}</p>
                        )}
                    </div>
                )}

                {lastCompletedChapter && Object.keys(lastCompletedChapter).length > 0 && (
                    <div className="mb-4 p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-2">Chapter mới nhất đã crawl:</h3>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">{lastCompletedChapter.comicName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Chapter: {lastCompletedChapter.chapterNumber} - {lastCompletedChapter.chapterTitle}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Số lượng ảnh: {lastCompletedChapter.imageCount}
                        </p>
                    </div>
                )}

                {progress?.errors && progress.errors.length > 0 && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
                        <h3 className="text-sm font-medium mb-2">Lỗi ({progress.errors.length}):</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            {progress.errors.map((error, index) => (
                                <li key={index}>
                                    {error.comicSlug}: {error.error}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {progress?.details && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-2">Chi tiết:</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {progress.details}
                        </p>
                    </div>
                )}

                {progress?.error && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
                        <h3 className="text-sm font-medium mb-2">Lỗi:</h3>
                        <p className="text-sm whitespace-pre-wrap">{progress.error}</p>
                    </div>
                )}

                {progress?.timestamp && (
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        Cập nhật gần nhất: {formatDate(progress.timestamp)}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
} 