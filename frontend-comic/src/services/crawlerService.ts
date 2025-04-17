import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {
    CrawlerOptions,
    CrawlerProgress,
    CrawlerResponse,
    // CrawlerStatusResponse
} from '@/types/crawler';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class CrawlerService {
    private baseUrl: string;
    private stompClient: Client | null = null;
    private sessionId: string | null = null;
    private progressCallback: ((progress: CrawlerProgress) => void) | null = null;

    constructor(baseUrl = BASE_URL) {
        this.baseUrl = baseUrl;
    }

    // Kết nối WebSocket
    connect(onConnected?: () => void, onError?: (error: unknown) => void): void {
        console.log(`Đang kết nối WebSocket tới: ${this.baseUrl}/ws`);

        try {
            const socket = new SockJS(`${this.baseUrl}/ws`);

            socket.onopen = () => {
                console.log('SockJS connection opened');
            };

            socket.onclose = (event) => {
                console.log(`SockJS connection closed: ${event.code} - ${event.reason}`);
            };

            socket.onerror = (error) => {
                console.error('SockJS error:', error);
            };

            this.stompClient = new Client({
                webSocketFactory: () => socket,
                debug: (str) => {
                    console.log('STOMP Debug:', str);
                },
                onConnect: () => {
                    console.log('Kết nối STOMP thành công');
                    if (onConnected) onConnected();
                },
                onDisconnect: () => {
                    console.log('Ngắt kết nối STOMP');
                },
                onStompError: (frame) => {
                    console.error('Lỗi STOMP:', frame);
                    if (onError) onError(frame);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000
            });

            this.stompClient.activate();
        } catch (error) {
            console.error('Lỗi khi khởi tạo WebSocket:', error);
            if (onError) onError(error);
        }
    }

    // Ngắt kết nối WebSocket
    disconnect(): void {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
        }
    }

    // Kiểm tra kết nối
    isConnected(): boolean {
        return this.stompClient !== null && this.stompClient.connected;
    }

    // Bắt đầu quá trình crawl
    async startCrawling(options: CrawlerOptions): Promise<CrawlerResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/crawler/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(options)
            });

            const result = await response.json();

            if (result.status === 200 || result.code === 'SUCCESS') {
                this.sessionId = result.data?.sessionId;
                return result;
            }

            return result;
        } catch (error: unknown) {
            console.error('Lỗi khi bắt đầu crawl:', error);
            const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
            return {
                status: 500,
                message: errorMessage,
                data: undefined
            };
        }
    }

    // Dừng quá trình crawl
    async stopCrawling(sid?: string): Promise<CrawlerResponse> {
        const sessionId = sid || this.sessionId;
        if (!sessionId) {
            return {
                status: 400,
                message: 'Không có phiên crawl đang chạy',
            };
        }

        try {
            const response = await fetch(`${this.baseUrl}/crawler/stop/${sessionId}`, {
                method: 'POST'
            });

            return await response.json();
        } catch (error: unknown) {
            console.error('Lỗi khi dừng crawl:', error);
            const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
            return {
                status: 500,
                message: errorMessage,
            };
        }
    }

    // // Kiểm tra trạng thái crawl
    // async getStatus(sid?: string): Promise<CrawlerStatusResponse> {
    //     const sessionId = sid || this.sessionId;
    //     if (!sessionId) {
    //         return {
    //             success: false,
    //             error: 'Không có phiên crawl đang chạy',
    //         };
    //     }

    //     try {
    //         const response = await fetch(`${this.baseUrl}/crawler/status/${sessionId}`);
    //         const result = await response.json();

    //         if (result.status === 200 || result.code === 'SUCCESS') {
    //             return {
    //                 success: true,
    //                 data: result.data
    //             };
    //         }

    //         return {
    //             success: false,
    //             error: result.message,
    //         };
    //     } catch (error: unknown) {
    //         console.error('Lỗi khi kiểm tra trạng thái:', error);
    //         const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
    //         return {
    //             success: false,
    //             error: errorMessage,
    //         };
    //     }
    // }

    // Đăng ký lắng nghe cập nhật tiến trình
    subscribe(callback: (progress: CrawlerProgress) => void, sid?: string): boolean {
        const sessionId = sid || this.sessionId;

        if (!this.stompClient || !this.stompClient.connected || !sessionId) {
            console.error('WebSocket chưa kết nối hoặc không có sessionId');
            return false;
        }

        this.progressCallback = callback;

        this.stompClient.subscribe(`/topic/crawler/${sessionId}`, (message) => {
            const progressData = JSON.parse(message.body);
            if (this.progressCallback) {
                this.progressCallback(progressData);
            }
        });

        return true;
    }

    // Lấy giá trị sessionId hiện tại
    getSessionId(): string | null {
        return this.sessionId;
    }

    // Thiết lập sessionId
    setSessionId(sid: string): void {
        this.sessionId = sid;
    }
}

export const crawlerService = new CrawlerService();
export default crawlerService;