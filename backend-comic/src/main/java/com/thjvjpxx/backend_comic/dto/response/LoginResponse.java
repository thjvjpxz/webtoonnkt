package com.thjvjpxx.backend_comic.dto.response;

import com.thjvjpxx.backend_comic.model.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String id;
    private String username;
    private String imgUrl;
    private Boolean vip;
    private Role role;
}