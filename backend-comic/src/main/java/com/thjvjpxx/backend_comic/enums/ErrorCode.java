package com.thjvjpxx.backend_comic.enums;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // Category
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "Thể loại không tồn tại!"),
    CATEGORY_INVALID(HttpStatus.BAD_REQUEST, "Thể loại không hợp lệ!"),
    CATEGORY_DUPLICATE(HttpStatus.BAD_REQUEST, "Thể loại đã tồn tại!"),
    NAME_CATEGORY_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tên thể loại không được trống!"),
    SLUG_CATEGORY_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Slug thể loại không được trống!"),

    // Comic
    COMIC_NOT_FOUND(HttpStatus.NOT_FOUND, "Truyện không tồn tại!"),
    COMIC_SLUG_EXISTS(HttpStatus.BAD_REQUEST, "Truyện đã tồn tại!"),
    NAME_COMIC_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tên truyện không được trống!"),
    SLUG_COMIC_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Slug truyện không được trống!"),

    // Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi máy chủ!");
    ;

    private HttpStatus status;
    private String message;
}
