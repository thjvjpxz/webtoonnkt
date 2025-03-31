package com.thjvjpxx.backend_comic.utils;

import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;

public class validation {
    public static void checkNullId(String id) {
        if (id == null || id.isEmpty()) {
            throw new BaseException(ErrorCode.ID_NOT_EMPTY);
        }
    }
}
