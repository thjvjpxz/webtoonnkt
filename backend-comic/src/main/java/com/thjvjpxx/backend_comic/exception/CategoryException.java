package com.thjvjpxx.backend_comic.exception;

import com.thjvjpxx.backend_comic.enums.ErrorCode;

import lombok.Getter;

@Getter
public class CategoryException extends RuntimeException {
    ErrorCode errorCode;

    public CategoryException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
