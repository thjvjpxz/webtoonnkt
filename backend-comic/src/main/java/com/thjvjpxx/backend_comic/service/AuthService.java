package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.LoginRequest;
import com.thjvjpxx.backend_comic.dto.request.RegisterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface AuthService {
    BaseResponse<?> login(LoginRequest loginRequest);

    BaseResponse<?> refreshToken(String refreshToken);

    BaseResponse<?> validateToken(String token);

    BaseResponse<?> register(RegisterRequest registerRequest);
}