package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.LoginRequest;
import com.thjvjpxx.backend_comic.dto.request.RegisterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

/**
 * Service xử lý đăng nhập, đăng ký, xác thực email
 */
public interface AuthService {
    /**
     * Đăng nhập
     * 
     * @param loginRequest DTO chứa username và password
     * @return Response chứa access token và refresh token
     */
    BaseResponse<?> login(LoginRequest loginRequest);

    /**
     * Làm mới token
     * 
     * @param refreshToken Refresh token
     * @return Response chứa access token mới
     */
    BaseResponse<?> refreshToken(String refreshToken);

    /**
     * Đăng ký
     * 
     * @param registerRequest DTO chứa thông tin đăng ký
     * @return Response chứa kết quả đăng ký
     */
    BaseResponse<?> register(RegisterRequest registerRequest);

    /**
     * Xác thực email
     * 
     * @param token Token cần xác thực
     * @return Response chứa kết quả xác thực
     */
    BaseResponse<?> verify(String token);

    /**
     * Quên mật khẩu
     * 
     * @param email Email người dùng
     * @return Response chứa kết quả quên mật khẩu
     */
    BaseResponse<?> forgotPassword(String email);

    /**
     * Đặt lại mật khẩu
     * 
     * @param token           Token cần đặt lại mật khẩu
     * @param password        Mật khẩu mới
     * @param confirmPassword Xác nhận mật khẩu mới
     * @return Response chứa kết quả đặt lại mật khẩu
     */
    BaseResponse<?> resetPassword(String token, String password, String confirmPassword);

    /**
     * Kiểm tra token đặt lại mật khẩu có hết hạn không
     * 
     * @param token Token cần kiểm tra
     * @return Response chứa kết quả kiểm tra
     */
    BaseResponse<?> checkResetPasswordTokenExpired(String token);
}