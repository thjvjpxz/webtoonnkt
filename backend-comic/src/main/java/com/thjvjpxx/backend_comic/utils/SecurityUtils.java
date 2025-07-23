package com.thjvjpxx.backend_comic.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * Lớp tiện ích cho các thao tác xử lý bảo mật
 */
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SecurityUtils {

    UserRepository userRepository;
    /**
     * Lấy thông tin người dùng hiện tại từ SecurityContext
     * 
     * @return User object của người dùng hiện tại
     * @throws BaseException với mã lỗi INVALID_TOKEN nếu không có authentication hoặc chưa xác thực
     * @throws BaseException với mã lỗi USER_NOT_FOUND nếu không tìm thấy user trong database
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BaseException(ErrorCode.INVALID_TOKEN);
        }

        String username = (String) authentication.getPrincipal();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * Lấy username của người dùng hiện tại
     * 
     * @return String username của người dùng hiện tại
     * @throws BaseException nếu có lỗi khi lấy thông tin người dùng hiện tại
     */
    public String getCurrentUsername() {
        return getCurrentUser().getUsername();
    }

    /**
     * Lấy ID của người dùng hiện tại
     * 
     * @return String ID của người dùng hiện tại
     * @throws BaseException nếu có lỗi khi lấy thông tin người dùng hiện tại
     */
    public String getCurrentUserId() {
        return getCurrentUser().getId();
    }

    /**
     * Kiểm tra xem người dùng hiện tại có phải là admin hay không
     * 
     * @return true nếu người dùng hiện tại có role là ADMIN, ngược lại false
     * @throws BaseException nếu có lỗi khi lấy thông tin người dùng hiện tại
     */
    public boolean isCurrentUserAdmin() {
        User currentUser = getCurrentUser();
        return "ADMIN".equals(currentUser.getRole().getName());
    }

    /**
     * Kiểm tra quyền truy cập tài nguyên của người dùng
     * Người dùng có thể truy cập tài nguyên nếu:
     * - Là chủ sở hữu tài nguyên (ID trùng khớp)
     * - Hoặc có quyền admin
     * 
     * @param targetUserId ID của người dùng mục tiêu cần kiểm tra quyền truy cập
     * @return true nếu có quyền truy cập, ngược lại false
     * @throws BaseException nếu có lỗi khi lấy thông tin người dùng hiện tại
     */
    public boolean canAccessUserResource(String targetUserId) {
        User currentUser = getCurrentUser();
        return currentUser.getId().equals(targetUserId) || isCurrentUserAdmin();
    }
}