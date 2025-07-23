package com.thjvjpxx.backend_comic.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.request.LoginRequest;
import com.thjvjpxx.backend_comic.dto.request.RegisterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.AuthService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    AuthService authService;

    /**
     * API đăng nhập
     * POST /auth/login
     * 
     * @param loginRequest DTO chứa username và password
     * @return Response chứa access token và refresh token
     */
    @PostMapping("/login")
    public BaseResponse<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    /**
     * API làm mới token
     * POST /auth/refresh
     * 
     * @param payload DTO chứa refresh token
     * @return Response chứa access token mới
     */
    @PostMapping("/refresh")
    public BaseResponse<?> refreshToken(@RequestBody Map<String, String> payload) {
        String refreshToken = payload.get("refreshToken");
        return authService.refreshToken(refreshToken);
    }

    /**
     * API đăng ký
     * POST /auth/register
     * 
     * @param registerRequest DTO chứa thông tin đăng ký
     * @return Response chứa kết quả đăng ký
     */
    @PostMapping("/register")
    public BaseResponse<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    /**
     * API xác thực email
     * GET /auth/verify
     * 
     * @param token token cần xác thực
     * @return Response chứa kết quả xác thực
     */
    @GetMapping("/verify")
    public BaseResponse<?> verify(@RequestParam String token) {
        return authService.verify(token);
    }

    /**
     * API quên mật khẩu
     * POST /auth/forgot-password
     * 
     * @param email Email người dùng
     * @return Response chứa kết quả quên mật khẩu
     */
    @PostMapping("/forgot-password")
    public BaseResponse<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        return authService.forgotPassword(email);
    }

    /**
     * API đặt lại mật khẩu
     * POST /auth/reset-password
     * 
     * @param payload DTO chứa token, mật khẩu mới và xác nhận mật khẩu mới
     * @return Response chứa kết quả đặt lại mật khẩu
     */
    @PostMapping("/reset-password")
    public BaseResponse<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String password = payload.get("password");
        String confirmPassword = payload.get("confirmPassword");
        return authService.resetPassword(token, password, confirmPassword);
    }

    /**
     * API kiểm tra token đặt lại mật khẩu có hết hạn không
     * GET /auth/check-reset-password-token-expired
     * 
     * @param token Token cần kiểm tra
     * @return Response chứa kết quả kiểm tra
     */
    @GetMapping("/check-reset-password-token-expired")
    public BaseResponse<?> checkResetPasswordTokenExpired(@RequestParam String token) {
        return authService.checkResetPasswordTokenExpired(token);
    }

    /**
     * API gửi lại email xác thực
     * POST /auth/resend-verification-email
     * 
     * @param payload DTO chứa email
     * @return Response chứa kết quả gửi lại email xác thực
     */
    @PostMapping("/resend-verification-email")
    public BaseResponse<?> resendVerificationEmail(@RequestBody LoginRequest loginRequest) {
        return authService.resendVerificationEmail(loginRequest);
    }
}