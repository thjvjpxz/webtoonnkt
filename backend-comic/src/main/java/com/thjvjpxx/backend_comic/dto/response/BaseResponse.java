package com.thjvjpxx.backend_comic.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse<T> {
    int status;
    String message;
    T data;
    LocalDateTime timestamp;

    Integer page;
    Integer total;
    Integer limit;
    Integer totalPages;

    public static <T> BaseResponse<T> success(T data) {
        return BaseResponse.<T>builder()
                .status(200)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> BaseResponse<T> success(String message) {
        return BaseResponse.<T>builder()
                .status(200)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> BaseResponse<T> success(T data, String message) {
        return BaseResponse.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> BaseResponse<T> success(T data, int page, int total, int limit, int totalPages) {
        return BaseResponse.<T>builder()
                .status(200)
                .data(data)
                .page(page)
                .total(total)
                .limit(limit)
                .totalPages(totalPages)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> BaseResponse<T> error(int status, String message) {
        return BaseResponse.<T>builder()
                .status(status)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> BaseResponse<T> error(int status, String message, T data) {
        return BaseResponse.<T>builder()
                .status(status)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
