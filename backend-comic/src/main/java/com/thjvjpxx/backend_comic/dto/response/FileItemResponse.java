package com.thjvjpxx.backend_comic.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO response cho file item
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileItemResponse {
    private String name; // Tên file hoặc folder
    private String fullPath; // Đường dẫn đầy đủ
    private String url; // URL đầy đủ (chỉ cho file)
    private String type; // "file" hoặc "folder"
    private Long size; // Kích thước file (bytes, null cho folder)
    private LocalDateTime lastModified; // Thời gian chỉnh sửa cuối
    private String contentType; // MIME type (chỉ cho file)
}