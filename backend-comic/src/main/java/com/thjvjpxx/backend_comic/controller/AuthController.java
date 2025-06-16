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
}