package com.thjvjpxx.backend_comic.dto.request;

import lombok.Data;

/**
 * DTO cho request thay đổi mật khẩu
 */
@Data
public class ChangePassRequest {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}
