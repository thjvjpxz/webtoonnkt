package com.thjvjpxx.backend_comic.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<BaseResponse<?>> handleCategoryException(BaseException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        return ResponseEntity
                .status(errorCode.getStatus())
                .body(BaseResponse.error(errorCode.getStatus().value(), errorCode.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<BaseResponse<?>> handleRuntimeException(RuntimeException ex) {
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        return ResponseEntity
                .status(errorCode.getStatus())
                .body(BaseResponse.error(errorCode.getStatus().value(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<?>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        try {
            ErrorCode errorCode = ErrorCode.valueOf(ex.getBindingResult().getFieldError().getDefaultMessage());
            return ResponseEntity
                    .status(errorCode.getStatus())
                    .body(BaseResponse.error(errorCode.getStatus().value(), errorCode.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                    .body(BaseResponse.error(ErrorCode.INTERNAL_SERVER_ERROR.getStatus().value(), e.getMessage()));
        }
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<BaseResponse<?>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        return ResponseEntity
                .status(ErrorCode.INVALID_ARGUMENT.getStatus())
                .body(BaseResponse.error(ErrorCode.INVALID_ARGUMENT.getStatus().value(),
                        "Dữ liệu gửi lên không hợp lệ"));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<BaseResponse<?>> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException ex) {
        return ResponseEntity
                .status(ErrorCode.INVALID_ARGUMENT.getStatus())
                .body(BaseResponse.error(ErrorCode.INVALID_ARGUMENT.getStatus().value(),
                        "Thiếu tham số bắt buộc: " + ex.getParameterName()));
    }
}
