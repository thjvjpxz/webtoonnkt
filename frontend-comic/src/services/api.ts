// Service cơ bản để gọi API
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Hàm xử lý lỗi chung
const handleError = (error: unknown) => {
    console.error("API Error:", error);

    if (error && typeof error === 'object' && 'response' in error) {
        // Lỗi từ server với response
        const errorResponse = error.response as { data?: { message?: string } };
        return {
            success: false,
            data: null,
            error: errorResponse.data?.message || "Lỗi từ server"
        };
    } else if (error && typeof error === 'object' && 'request' in error) {
        // Lỗi không nhận được response
        return {
            success: false,
            data: null,
            error: "Không thể kết nối đến server"
        };
    } else {
        // Lỗi khác
        const errorMessage = error && typeof error === 'object' && 'message' in error
            ? error.message as string
            : "Đã xảy ra lỗi";
        return {
            success: false,
            data: null,
            error: errorMessage
        };
    }
};

// Hàm fetch API chung
export const fetchApi = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    try {
        const url = `${API_URL}${endpoint}`;

        // Thiết lập headers mặc định
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Kiểm tra nếu response không ok
        if (!response.ok) {
            const errorData = await response.json();
            throw {
                response: {
                    status: response.status,
                    data: errorData,
                },
            };
        }

        return await response.json();
    } catch (error) {
        throw handleError(error);
    }
}; 