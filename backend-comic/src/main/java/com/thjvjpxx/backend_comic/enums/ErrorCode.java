package com.thjvjpxx.backend_comic.enums;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // Common
    ID_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Id không được trống!"),

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

    // Level Type
    LEVEL_TYPE_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Loại level không được trống!"),
    LEVEL_TYPE_NOT_FOUND(HttpStatus.NOT_FOUND, "Loại level không tồn tại!"),
    LEVEL_TYPE_DUPLICATE(HttpStatus.BAD_REQUEST, "Loại level đã tồn tại!"),

    // Level
    LEVEL_NUMBER_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Level không được trống!"),
    LEVEL_NAME_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tên level không được trống!"),
    LEVEL_EXP_REQUIRED_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Exp cần để đạt level không được trống!"),
    LEVEL_EXP_REQUIRED_NOT_MIN(HttpStatus.BAD_REQUEST, "Exp cần để đạt level phải lớn hơn hoặc bằng 0!"),
    LEVEL_DUPLICATE(HttpStatus.BAD_REQUEST, "Level đã tồn tại!"),
    LEVEL_NOT_FOUND(HttpStatus.NOT_FOUND, "Level không tồn tại!"),
    LEVEL_NUMBER_NOT_MIN(HttpStatus.BAD_REQUEST, "Level phải lớn hơn hoặc bằng 1!"),

    // Chapter
    CHAPTER_TITLE_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tiêu đề chapter không được trống!"),
    CHAPTER_STATUS_NOT_NULL(HttpStatus.BAD_REQUEST, "Trạng thái chapter không được trống!"),
    CHAPTER_NUMBER_NOT_MIN(HttpStatus.BAD_REQUEST, "Số chapter phải lớn hơn hoặc bằng 0!"),
    CHAPTER_COMIC_ID_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Truyện không được trống!"),
    CHAPTER_DETAIL_CHAPTER_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Chapter chi tiết không được trống!"),
    CHAPTER_REQUEST_NOT_NULL(HttpStatus.BAD_REQUEST, "Chapter request không được trống!"),

    // Detail Chapter
    DETAIL_CHAPTER_IMAGE_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Ảnh chapter không được trống!"),
    DETAIL_CHAPTER_IMAGE_URL_NOT_EMPTY(HttpStatus.BAD_REQUEST, "URL ảnh chapter không được trống!"),

    // Handle File
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "File không tồn tại!"),
    INVALID_ARGUMENT(HttpStatus.BAD_REQUEST, "Tham số không hợp lệ!"),
    TYPE_NOT_FOUND(HttpStatus.BAD_REQUEST, "Loại không tồn tại!"),
    UPLOAD_FILE_FAILED(HttpStatus.BAD_REQUEST, "Lưu file thất bại!"),
    FILE_EXISTS(HttpStatus.BAD_REQUEST, "File đã tồn tại!"),

    // Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi máy chủ!");
    ;

    private HttpStatus status;
    private String message;
}
