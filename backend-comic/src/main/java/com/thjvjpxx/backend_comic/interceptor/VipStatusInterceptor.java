package com.thjvjpxx.backend_comic.interceptor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.service.VipExpirationService;
import com.thjvjpxx.backend_comic.utils.SecurityUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

/**
 * Interceptor cho VIP status để kiểm tra và cập nhật status VIP của user
 */
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class VipStatusInterceptor implements HandlerInterceptor {

    VipExpirationService vipExpirationService;
    SecurityUtils securityUtils;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        try {
            // Chỉ kiểm tra với các request có authentication
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated()
                    && !"anonymousUser".equals(authentication.getPrincipal())) {

                // Lấy user hiện tại và kiểm tra VIP status
                User currentUser = securityUtils.getCurrentUser();
                if (currentUser != null && currentUser.getVip()) {
                    vipExpirationService.checkAndUpdateUserVipStatus(currentUser);
                }
            }
        } catch (Exception e) {
            // Log lỗi nhưng không block request
            log.warn("Lỗi khi kiểm tra VIP status: {}", e.getMessage());
        }

        return true; // Luôn cho phép request tiếp tục
    }
}