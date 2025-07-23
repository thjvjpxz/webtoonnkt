package com.thjvjpxx.backend_comic.exception;

import com.thjvjpxx.backend_comic.enums.ErrorCode;

import lombok.Getter;

/**
 * Exception cho tất cả exception
 */
@Getter
public class BaseException extends RuntimeException {
    ErrorCode errorCode;

    public BaseException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
