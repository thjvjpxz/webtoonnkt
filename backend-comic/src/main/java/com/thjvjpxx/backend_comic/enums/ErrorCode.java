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
    REQUEST_BODY_INVALID(HttpStatus.BAD_REQUEST, "Body yêu cầu không hợp lệ!"),

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
    CHAPTER_ALREADY_PURCHASED(HttpStatus.BAD_REQUEST, "chương đã được mua!"),
    CHAPTER_IS_FREE(HttpStatus.BAD_REQUEST, "chương này miễn phí!"),
    CHAPTER_NOT_PURCHASED(HttpStatus.FORBIDDEN, "Bạn cần mua chapter này hoặc có gói VIP để có thể đọc!"),
    CHAPTER_REQUIRES_LOGIN(HttpStatus.BAD_REQUEST, "Vui lòng đăng nhập để đọc chapter có phí!"),

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
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "Token không hợp lệ hoặc đã hết hạn!"),
    TOKEN_REQUIRED(HttpStatus.UNAUTHORIZED, "Yêu cầu token!"),
    PERMISSION_DENIED(HttpStatus.FORBIDDEN, "Không có quyền truy cập!"),
    REFRESH_TOKEN_INVALID(HttpStatus.UNAUTHORIZED, "Refresh token không hợp lệ hoặc đã hết hạn!"),
    REFRESH_TOKEN_REQUIRED(HttpStatus.UNAUTHORIZED, "Yêu cầu refresh token!"),
    INVALID_OLD_PASSWORD(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không chính xác!"),
    PASSWORD_AND_CONFIRM_NOT_MATCH(HttpStatus.BAD_REQUEST, "Mật khẩu và mật khẩu xác nhận không khớp!"),
    USER_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "Tài khoản đã bị xóa!"),
    USER_ALREADY_BLOCKED(HttpStatus.BAD_REQUEST, "Tài khoản đã bị khóa!"),
    USER_NOT_ACTIVE(HttpStatus.BAD_REQUEST, "Tài khoản chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt!"),
    USER_ALREADY_ACTIVE(HttpStatus.BAD_REQUEST, "Tài khoản đã được kích hoạt!"),

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
    RESET_PASSWORD_TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "Token đặt lại mật khẩu đã hết hạn!"),
    RESET_PASSWORD_TOKEN_INVALID(HttpStatus.BAD_REQUEST, "Token đặt lại mật khẩu không hợp lệ!"),

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

    // Topup
    TOPUP_AMOUNT_NOT_NULL(HttpStatus.BAD_REQUEST, "Số tiền nạp không được trống!"),
    TOPUP_AMOUNT_MUST_BE_POSITIVE(HttpStatus.BAD_REQUEST, "Số tiền nạp phải lớn hơn 0!"),
    TOPUP_AMOUNT_TOO_LOW(HttpStatus.BAD_REQUEST, "Số tiền nạp tối thiểu là 2 Linh Thạch!"),
    TOPUP_AMOUNT_TOO_HIGH(HttpStatus.BAD_REQUEST, "Số tiền nạp tối đa là 1,000 Linh Thạch!"),
    PAYOS_CREATE_PAYMENT_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "Tạo link thanh toán thất bại!"),

    // Vip Package
    VIP_PACKAGE_NOT_FOUND(HttpStatus.NOT_FOUND, "Gói VIP không tồn tại!"),
    VIP_PACKAGE_INVALID(HttpStatus.BAD_REQUEST, "Thông tin gói VIP không hợp lệ!"),
    VIP_PACKAGE_NAME_EXISTS(HttpStatus.BAD_REQUEST, "Tên gói VIP đã tồn tại!"),
    VIP_PACKAGE_NAME_NOT_EMPTY(HttpStatus.BAD_REQUEST, "Tên gói VIP không được trống!"),
    VIP_PACKAGE_ID_NOT_EMPTY(HttpStatus.BAD_REQUEST, "ID gói VIP không được trống!"),
    ORIGINAL_PRICE_NOT_NULL(HttpStatus.BAD_REQUEST, "Giá gốc không được trống!"),
    ORIGINAL_PRICE_MUST_BE_POSITIVE(HttpStatus.BAD_REQUEST, "Giá gốc phải lớn hơn 0!"),
    DURATION_DAYS_NOT_NULL(HttpStatus.BAD_REQUEST, "Thời hạn không được trống!"),
    DURATION_DAYS_MUST_BE_POSITIVE(HttpStatus.BAD_REQUEST, "Thời hạn phải lớn hơn 0!"),
    IS_ACTIVE_NOT_NULL(HttpStatus.BAD_REQUEST, "Trạng thái không được trống!"),

    // Publisher Request
    ALREADY_ADMIN(HttpStatus.BAD_REQUEST, "Bạn là admin, không thể gửi yêu cầu!"),
    ALREADY_PUBLISHER(HttpStatus.BAD_REQUEST, "Bạn đã là nhà xuất bản, không thể gửi yêu cầu!"),
    ALREADY_REQUESTED(HttpStatus.BAD_REQUEST, "Bạn đã gửi yêu cầu trước đó, vui lòng chờ duyệt!"),
    PUBLISHER_REQUEST_NOT_FOUND(HttpStatus.NOT_FOUND, "Yêu cầu trở thành nhà xuất bản không tồn tại!"),
    PUBLISHER_REQUEST_ALREADY_UPDATED(HttpStatus.BAD_REQUEST, "Yêu cầu đã được cập nhật trước đó!"),

    // Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi máy chủ!");
    ;

    private HttpStatus status;
    private String message;
}
