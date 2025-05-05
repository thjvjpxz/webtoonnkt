package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
    @NotBlank(message = "USERNAME_NOT_EMPTY")
    String username;

    @NotBlank(message = "EMAIL_NOT_EMPTY")
    @Email(message = "EMAIL_INVALID")
    String email;

    String password;

    String imgUrl;

    Boolean vip;

    Boolean active;

    String roleId;

    Double balance;

    String levelId;
}
