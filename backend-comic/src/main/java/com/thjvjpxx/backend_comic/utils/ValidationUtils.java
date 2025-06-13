package com.thjvjpxx.backend_comic.utils;

import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;

/**
 * Lớp tiện ích cho các thao tác xử lý validation
 */
public class ValidationUtils {
    /**
     * Kiểm tra xem ID có null hoặc rỗng không
     * 
     * @param id ID cần kiểm tra
     * @throws BaseException với mã lỗi ID_NOT_EMPTY nếu ID là null hoặc rỗng
     */
    public static void checkNullId(String id) {
        if (id == null || id.isEmpty()) {
            throw new BaseException(ErrorCode.ID_NOT_EMPTY);
        }
    }
}
