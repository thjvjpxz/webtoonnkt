package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO cho request đăng nhập
 */
@Data
public class LoginRequest {
    @NotBlank(message = "USERNAME_NOT_EMPTY")
    private String username;
    @NotBlank(message = "PASSWORD_NOT_EMPTY")
    private String password;
}
