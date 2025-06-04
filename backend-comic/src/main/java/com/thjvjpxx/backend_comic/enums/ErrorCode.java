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
    CHAPTER_REQUEST_NOT_NULL(HttpStatus.BAD_REQUEST, "Chapter request không được trống!"),
    CHAPTER_NOT_FOUND(HttpStatus.NOT_FOUND, "Chương không tồn tại!"),
    CHAPTER_NUMBER_EXISTS(HttpStatus.BAD_REQUEST, "Số chương đã tồn tại!"),

    // Detail Chapter
    DETAIL_CHAPTER_IMAGE_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Ảnh không được trống!"),
    DETAIL_CHAPTER_IMAGE_URL_NOT_EMPTY(HttpStatus.BAD_REQUEST, "URL ảnh không được trống!"),
    DETAIL_CHAPTER_NOT_FOUND(HttpStatus.NOT_FOUND, "Chương không tồn tại!"),

    // User và Authentication
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "Người dùng không tồn tại!"),
    USERNAME_EXISTS(HttpStatus.BAD_REQUEST, "Tên đăng nhập đã tồn tại!"),
    USERNAME_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tên đăng nhập không được trống!"),
    EMAIL_EXISTS(HttpStatus.BAD_REQUEST, "Email đã tồn tại!"),
    EMAIL_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Email không được trống!"),
    EMAIL_INVALID(HttpStatus.BAD_REQUEST, "Email không hợp lệ!"),
    PASSWORD_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Mật khẩu không được trống!"),
    PASSWORD_NOT_MATCH(HttpStatus.BAD_REQUEST, "Mật khẩu không đúng!"),
    CONFIRM_PASSWORD_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Mật khẩu xác nhận không được trống!"),
    USER_INACTIVE(HttpStatus.FORBIDDEN, "Tài khoản chưa được kích hoạt!"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Thông tin đăng nhập không hợp lệ!"),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "Token không hợp lệ hoặc đã hết hạn!"),
    TOKEN_REQUIRED(HttpStatus.UNAUTHORIZED, "Yêu cầu token!"),
    PERMISSION_DENIED(HttpStatus.FORBIDDEN, "Không có quyền truy cập!"),
    REFRESH_TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "Refresh token không hợp lệ hoặc đã hết hạn!"),
    REFRESH_TOKEN_REQUIRED(HttpStatus.UNAUTHORIZED, "Yêu cầu refresh token!"),
    INVALID_OLD_PASSWORD(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không chính xác!"),
    PASSWORD_AND_CONFIRM_NOT_MATCH(HttpStatus.BAD_REQUEST, "Mật khẩu và mật khẩu xác nhận không khớp!"),

    // Role
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Role không tồn tại!"),

    // Crawler
    CRAWLER_NOT_FOUND(HttpStatus.NOT_FOUND, "Tiến trình crawl không tồn tại!"),

    // Handle File
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "File không tồn tại!"),
    INVALID_ARGUMENT(HttpStatus.BAD_REQUEST, "Tham số không hợp lệ!"),
    TYPE_NOT_FOUND(HttpStatus.BAD_REQUEST, "Loại không tồn tại!"),
    UPLOAD_FILE_FAILED(HttpStatus.BAD_REQUEST, "Lưu file thất bại!"),
    FILE_EXISTS(HttpStatus.BAD_REQUEST, "File đã tồn tại!"),

    // Email
    EMAIL_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Gửi email thất bại!"),
    EMAIL_INVALID_RECIPIENT(HttpStatus.BAD_REQUEST, "Địa chỉ email người nhận không hợp lệ!"),
    EMAIL_TEMPLATE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi xử lý template email!"),
    VERIFICATION_TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "Token xác thực đã hết hạn!"),

    // User Follow
    USER_FOLLOW_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "Người dùng đã theo dõi truyện này!"),
    USER_FOLLOW_NOT_FOUND(HttpStatus.NOT_FOUND, "Người dùng không theo dõi truyện này!"),

    // Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi máy chủ!");
    ;

    private HttpStatus status;
    private String message;
}
