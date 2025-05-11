package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
    @NotBlank(message = "USERNAME_NOT_EMPTY")
    String username;
    @NotBlank(message = "EMAIL_NOT_EMPTY")
    String email;
    @NotBlank(message = "PASSWORD_NOT_EMPTY")
    String password;
    @NotBlank(message = "CONFIRM_PASSWORD_NOT_EMPTY")
    String confirmPassword;
}
