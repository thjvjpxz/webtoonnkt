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
}