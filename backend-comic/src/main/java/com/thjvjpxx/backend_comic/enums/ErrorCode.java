package com.thjvjpxx.backend_comic.enums;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // Common
    ID_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Id không được trống!"),
    HAS_ERROR(HttpStatus.BAD_REQUEST, "Có lỗi xảy ra vui lòng thử lại sau!"),

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
    COMIC_HAS_CHAPTERS(HttpStatus.BAD_REQUEST, "Truyện này vẫn còn chương, không thể xóa!"),

    // Level Type
    LEVEL_TYPE_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Loại cấp độ không được trống!"),
    LEVEL_TYPE_NOT_FOUND(HttpStatus.NOT_FOUND, "Loại cấp độ không tồn tại!"),
    LEVEL_TYPE_DUPLICATE(HttpStatus.BAD_REQUEST, "Loại cấp độ đã tồn tại!"),
    LEVEL_TYPE_CANNOT_DELETE_IN_USE(HttpStatus.BAD_REQUEST,
            "Không thể xóa loại cấp độ này vì vẫn có cấp độ đang sử dụng!"),

    // Level
    LEVEL_NUMBER_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Cấp độ không được trống!"),
    LEVEL_NAME_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tên cấp độ không được trống!"),
    LEVEL_EXP_REQUIRED_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Exp cần để đạt cấp độ không được trống!"),
    LEVEL_EXP_REQUIRED_NOT_MIN(HttpStatus.BAD_REQUEST, "Exp cần để đạt cấp độ phải lớn hơn hoặc bằng 0!"),
    LEVEL_DUPLICATE(HttpStatus.BAD_REQUEST, "Cấp độ đã tồn tại!"),
    LEVEL_NOT_FOUND(HttpStatus.NOT_FOUND, "Cấp độ không tồn tại!"),
    LEVEL_NUMBER_NOT_MIN(HttpStatus.BAD_REQUEST, "Cấp độ phải lớn hơn hoặc bằng 1!"),
    LEVEL_CANNOT_DELETE_IN_USE(HttpStatus.BAD_REQUEST, "Không thể xóa cấp độ này vì vẫn có người dùng đang sử dụng!"),

    // Chapter
    CHAPTER_TITLE_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tiêu đề chương không được trống!"),
    CHAPTER_STATUS_NOT_NULL(HttpStatus.BAD_REQUEST, "Trạng thái chương không được trống!"),
    CHAPTER_NUMBER_NOT_MIN(HttpStatus.BAD_REQUEST, "Số chương phải lớn hơn hoặc bằng 0!"),
    CHAPTER_COMIC_ID_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Truyện không được trống!"),
    CHAPTER_REQUEST_NOT_NULL(HttpStatus.BAD_REQUEST, "Chương request không được trống!"),
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
    USER_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "Tài khoản đã bị xóa!"),
    USER_ALREADY_BLOCKED(HttpStatus.BAD_REQUEST, "Tài khoản đã bị khóa!"),

    // Role
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "Role không tồn tại!"),

    // Crawler
    CRAWLER_NOT_FOUND(HttpStatus.NOT_FOUND, "Tiến trình crawl không tồn tại!"),

    // Handle File
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "File không tồn tại!"),
    INVALID_ARGUMENT(HttpStatus.BAD_REQUEST, "Tham số không hợp lệ!"),
    TYPE_NOT_FOUND(HttpStatus.BAD_REQUEST, "Loại không tồn tại!"),
    UPLOAD_FILE_FAILED(HttpStatus.BAD_REQUEST, "Lưu file thất bại!"),
    DELETE_FILE_FAILED(HttpStatus.BAD_REQUEST, "Xoá file thất bại!"),
    RENAME_FILE_FAILED(HttpStatus.BAD_REQUEST, "Đổi tên file thất bại!"),

    // Email
    EMAIL_SEND_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Gửi email thất bại!"),
    EMAIL_INVALID_RECIPIENT(HttpStatus.BAD_REQUEST, "Địa chỉ email người nhận không hợp lệ!"),
    EMAIL_TEMPLATE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi xử lý template email!"),
    VERIFICATION_TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "Token xác thực đã hết hạn!"),

    // User Follow
    USER_FOLLOW_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "Người dùng đã theo dõi truyện này!"),
    USER_FOLLOW_NOT_FOUND(HttpStatus.NOT_FOUND, "Người dùng không theo dõi truyện này!"),

    // Comment
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Bình luận không tồn tại!"),
    COMMENT_CONTENT_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Nội dung bình luận không được trống!"),
    COMMENT_COMIC_ID_NOT_EMPTY(HttpStatus.BAD_REQUEST, "ID truyện không được trống!"),
    COMMENT_ACCESS_DENIED(HttpStatus.FORBIDDEN, "Không có quyền thực hiện thao tác này!"),
    COMMENT_PARENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Bình luận cha không tồn tại!"),
    COMMENT_PARENT_INVALID(HttpStatus.BAD_REQUEST, "Bình luận cha không hợp lệ!"),
    COMMENT_ALREADY_BLOCKED(HttpStatus.BAD_REQUEST, "Bình luận đã bị chặn!"),
    COMMENT_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "Bình luận đã bị xóa!"),

    // Publisher
    PUBLISHER_COMIC_NAME_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tên truyện không được để trống!"),
    PUBLISHER_COMIC_NAME_TOO_LONG(HttpStatus.BAD_REQUEST, "Tên truyện không được vượt quá 255 ký tự!"),
    PUBLISHER_COMIC_ORIGIN_NAME_TOO_LONG(HttpStatus.BAD_REQUEST, "Tên gốc không được vượt quá 255 ký tự!"),
    PUBLISHER_COMIC_AUTHOR_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tác giả không được để trống!"),
    PUBLISHER_COMIC_AUTHOR_TOO_LONG(HttpStatus.BAD_REQUEST, "Tên tác giả không được vượt quá 255 ký tự!"),
    PUBLISHER_COMIC_DESCRIPTION_TOO_LONG(HttpStatus.BAD_REQUEST, "Mô tả không được vượt quá 1000 ký tự!"),
    PUBLISHER_COMIC_CATEGORIES_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Danh sách thể loại không được để trống!"),
    PUBLISHER_COMIC_CATEGORIES_MIN_ONE(HttpStatus.BAD_REQUEST, "Phải chọn ít nhất 1 thể loại!"),
    PUBLISHER_COMIC_NOT_OWNER(HttpStatus.FORBIDDEN, "Bạn không có quyền thao tác với truyện này!"),

    PUBLISHER_CHAPTER_TITLE_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tiêu đề chương không được để trống!"),
    PUBLISHER_CHAPTER_TITLE_TOO_LONG(HttpStatus.BAD_REQUEST, "Tiêu đề chương không được vượt quá 255 ký tự!"),
    PUBLISHER_CHAPTER_NUMBER_INVALID(HttpStatus.BAD_REQUEST, "Số chương phải lớn hơn 0!"),
    PUBLISHER_CHAPTER_PRICE_INVALID(HttpStatus.BAD_REQUEST, "Giá chương phải lớn hơn hoặc bằng 0!"),
    PUBLISHER_CHAPTER_STATUS_NOT_NULL(HttpStatus.BAD_REQUEST, "Trạng thái chương không được trống!"),
    PUBLISHER_CHAPTER_IMAGES_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Danh sách ảnh không được để trống!"),
    PUBLISHER_CHAPTER_IMAGES_MIN_ONE(HttpStatus.BAD_REQUEST, "Phải có ít nhất 1 ảnh!"),

    // Transaction & Payment
    TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND, "Giao dịch không tồn tại!"),
    TRANSACTION_INVALID_AMOUNT(HttpStatus.BAD_REQUEST, "Số tiền không hợp lệ!"),
    TRANSACTION_INSUFFICIENT_BALANCE(HttpStatus.BAD_REQUEST, "Số dư không đủ!"),
    CHAPTER_ALREADY_PURCHASED(HttpStatus.BAD_REQUEST, "chương đã được mua!"),
    CHAPTER_IS_FREE(HttpStatus.BAD_REQUEST, "chương này miễn phí!"),

    // Withdrawal
    WITHDRAWAL_AMOUNT_INVALID(HttpStatus.BAD_REQUEST, "Số tiền rút không hợp lệ!"),
    WITHDRAWAL_INSUFFICIENT_BALANCE(HttpStatus.BAD_REQUEST, "Số dư không đủ để rút!"),
    WITHDRAWAL_PENDING_EXISTS(HttpStatus.BAD_REQUEST, "Bạn đã có yêu cầu rút tiền đang chờ xử lý!"),
    WITHDRAWAL_BANK_INFO_REQUIRED(HttpStatus.BAD_REQUEST, "Thông tin ngân hàng là bắt buộc!"),
    WITHDRAWAL_NOT_FOUND(HttpStatus.NOT_FOUND, "Yêu cầu rút tiền không tồn tại!"),
    WITHDRAWAL_NOT_PENDING(HttpStatus.BAD_REQUEST, "Yêu cầu rút tiền không ở trạng thái chờ xử lý!"),

    // Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi máy chủ!");
    ;

    private HttpStatus status;
    private String message;
}
