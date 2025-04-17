import { useState, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { CrawlerOptions, CrawlerProgress, CrawlerStatus, LastCompletedChapter } from "@/types/crawler";
import crawlerService from "@/services/crawlerService";
import { usePathname } from "next/navigation";

export const useCrawler = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [progress, setProgress] = useState<CrawlerProgress | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastCompletedChapter, setLastCompletedChapter] = useState<LastCompletedChapter | null>(null);
    const [options, setOptions] = useState<CrawlerOptions>({
        startPage: 1,
        endPage: 5,
        saveDrive: false,
    });

    // Tham chiếu để theo dõi interval
    const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();

    // Hàm xử lý cập nhật tiến trình
    const handleProgress = useCallback((progressData: CrawlerProgress) => {
        setProgress(progressData);

        // Cập nhật thông tin chapter mới nhất nếu có
        if (progressData.lastCompletedChapter &&
            Object.keys(progressData.lastCompletedChapter).length > 0) {
            setLastCompletedChapter(progressData.lastCompletedChapter);
        }

        // Nếu đã hoàn thành hoặc lỗi, dừng việc kiểm tra
        if (progressData.status === CrawlerStatus.COMPLETED) {
            toast.success("Crawl dữ liệu thành công");
            if (statusIntervalRef.current) {
                clearInterval(statusIntervalRef.current);
                statusIntervalRef.current = null;
            }
        } else if (progressData.status === CrawlerStatus.ERROR) {
            toast.error(`Lỗi: ${progressData.error || "Không xác định"}`);
            if (statusIntervalRef.current) {
                clearInterval(statusIntervalRef.current);
                statusIntervalRef.current = null;
            }
        }
    }, []);

    // Kết nối WebSocket
    useEffect(() => {
        crawlerService.connect(
            // onConnected
            () => {
                setIsConnected(true);

                // Nếu có sẵn sessionId, đăng ký nhận cập nhật
                if (sessionId) {
                    crawlerService.subscribe(handleProgress, sessionId);
                }
            },
            // onError
            (error) => {
                console.error("Lỗi kết nối WebSocket:", error);
                toast.error("Không thể kết nối đến máy chủ");
                setIsConnected(false);
            }
        );

        return () => {
            crawlerService.disconnect();

            // Xóa interval khi unmount
            if (statusIntervalRef.current) {
                clearInterval(statusIntervalRef.current);
                statusIntervalRef.current = null;
            }
        };
    }, [sessionId, handleProgress]);

    // // Lấy trạng thái crawler
    // const fetchCrawlerStatus = useCallback(async (sid: string) => {
    //     try {
    //         const result = await crawlerService.getStatus(sid);

    //         if (result.success && result.data) {
    //             setProgress(result.data);

    //             // Cập nhật thông tin chapter mới nhất nếu có
    //             if (result.data.lastCompletedChapter &&
    //                 Object.keys(result.data.lastCompletedChapter).length > 0) {
    //                 setLastCompletedChapter(result.data.lastCompletedChapter);
    //             }

    //             // Nếu đã hoàn thành hoặc lỗi, dừng việc kiểm tra
    //             if (result.data.status === CrawlerStatus.COMPLETED) {
    //                 toast.success("Crawl dữ liệu thành công");
    //                 if (statusIntervalRef.current) {
    //                     clearInterval(statusIntervalRef.current);
    //                     statusIntervalRef.current = null;
    //                 }
    //             } else if (result.data.status === CrawlerStatus.ERROR) {
    //                 toast.error(`Lỗi: ${result.data.error || "Không xác định"}`);
    //                 if (statusIntervalRef.current) {
    //                     clearInterval(statusIntervalRef.current);
    //                     statusIntervalRef.current = null;
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi lấy trạng thái crawler:", error);
    //     }
    // }, []);

    // Cập nhật options
    const updateOptions = useCallback((newOptions: Partial<CrawlerOptions>) => {
        setOptions((prev) => ({ ...prev, ...newOptions }));
    }, []);

    // Bắt đầu crawl
    const startCrawling = useCallback(async () => {
        if (!isConnected) {
            toast.error("Chưa kết nối được với máy chủ");
            return;
        }

        setIsLoading(true);
        try {
            const result = await crawlerService.startCrawling(options);

            if ((result.status === 200 || result.code === 'SUCCESS') && result.data) {
                const newSessionId = result.data.sessionId;
                setSessionId(newSessionId);
                crawlerService.setSessionId(newSessionId);

                // Đăng ký nhận cập nhật tiến trình
                crawlerService.subscribe(handleProgress, newSessionId);

                // Lấy trạng thái ban đầu
                // await fetchCrawlerStatus(newSessionId);

                // Thiết lập interval để kiểm tra trạng thái
                if (statusIntervalRef.current) {
                    clearInterval(statusIntervalRef.current);
                }

                // statusIntervalRef.current = setInterval(() => {
                //     fetchCrawlerStatus(newSessionId);
                // }, 2000); // Kiểm tra mỗi 2 giây

                toast.success("Bắt đầu crawl dữ liệu");
            } else {
                toast.error(result.message || "Không thể bắt đầu crawl");
            }
        } catch (error) {
            console.error("Lỗi khi bắt đầu crawl:", error);
            toast.error("Đã xảy ra lỗi khi kết nối với máy chủ");
        } finally {
            setIsLoading(false);
        }
    }, [isConnected, options, handleProgress]);

    // Dừng crawl
    const stopCrawling = useCallback(async () => {
        if (!sessionId) return;

        try {
            const result = await crawlerService.stopCrawling(sessionId);

            if (result.status === 200 || result.code === 'SUCCESS') {
                toast.success("Đã dừng crawl");

                // Dừng kiểm tra trạng thái
                if (statusIntervalRef.current) {
                    clearInterval(statusIntervalRef.current);
                    statusIntervalRef.current = null;
                }

                // Lấy trạng thái cuối cùng
                // await fetchCrawlerStatus(sessionId);
            } else {
                toast.error(result.message || "Không thể dừng crawl");
            }
        } catch (error) {
            console.error("Lỗi khi dừng crawl:", error);
            toast.error("Đã xảy ra lỗi khi dừng crawl");
        }
    }, [sessionId]);

    // Xử lý khi rời khỏi trang crawler
    useEffect(() => {
        // Chỉ chạy khi path là /dashboard/crawler
        if (pathname === "/dashboard/crawler") {
            // Cleanup function sẽ được gọi khi component unmount hoặc pathname thay đổi
            return () => {
                // Nếu đang trong quá trình crawl và rời khỏi trang crawler
                if (sessionId && progress?.status === CrawlerStatus.IN_PROGRESS) {
                    console.log('Rời khỏi trang crawler, đang dừng crawler...');

                    // Tự động dừng crawler
                    crawlerService.stopCrawling(sessionId)
                        .then(result => {
                            if (result.status === 200 || result.code === 'SUCCESS') {
                                console.log('Đã tự động dừng crawler khi rời khỏi trang');

                                // Dừng kiểm tra trạng thái
                                if (statusIntervalRef.current) {
                                    clearInterval(statusIntervalRef.current);
                                    statusIntervalRef.current = null;
                                }
                            }
                        })
                        .catch(error => {
                            console.error('Lỗi khi tự động dừng crawler:', error);
                        });
                }
            };
        }
    }, [pathname, sessionId, progress?.status]);

    const calculateProgress = (currentPage: number, totalPages: number, startPage: number, endPage: number) => {
        // Nếu chỉ crawl 1 trang (startPage = endPage)
        if (startPage === endPage) {
            // Nếu đã đến đúng trang đó, hiển thị 100%, nếu không hiển thị 0%
            return currentPage === startPage ? 100 : 0;
        }

        // Số trang cần crawl
        const pagesToCrawl = endPage - startPage + 1;

        // Nếu trang hiện tại nhỏ hơn trang bắt đầu
        if (currentPage < startPage) {
            return 0;
        }

        // Nếu trang hiện tại lớn hơn trang kết thúc
        if (currentPage > endPage) {
            return 100;
        }

        // Số trang đã crawl
        const pagesProcessed = currentPage - startPage + 1;

        // Tính phần trăm
        return Math.round((pagesProcessed / pagesToCrawl) * 100);
    };

    return {
        isConnected,
        isLoading,
        options,
        progress,
        sessionId,
        lastCompletedChapter,
        updateOptions,
        startCrawling,
        stopCrawling,
        calculateProgress
    };
};

export default useCrawler;