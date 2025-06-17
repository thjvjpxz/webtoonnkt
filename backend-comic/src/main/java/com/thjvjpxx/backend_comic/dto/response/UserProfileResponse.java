package com.thjvjpxx.backend_comic.dto.response;

import java.time.LocalDateTime;

import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.Role;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileResponse {
    String id;
    String username;
    String email;
    String imgUrl;
    Boolean vip;
    Boolean active;
    Boolean blocked;
    Boolean deleted;
    Role role;
    Double balance;
    Level level;
    Integer currentExp;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Integer nextLevelExpRequired;
}
