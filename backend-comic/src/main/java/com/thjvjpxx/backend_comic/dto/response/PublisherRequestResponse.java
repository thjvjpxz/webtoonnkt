package com.thjvjpxx.backend_comic.dto.response;

import java.time.LocalDateTime;

import com.thjvjpxx.backend_comic.model.Level;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO response cho request của publisher
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PublisherRequestResponse {
    String id;
    String userId;
    String username;
    Level level;
    String status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}