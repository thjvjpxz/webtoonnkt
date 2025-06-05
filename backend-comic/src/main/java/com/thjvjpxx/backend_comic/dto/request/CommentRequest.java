package com.thjvjpxx.backend_comic.dto.request;

import com.thjvjpxx.backend_comic.enums.CommentStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentRequest {

    @NotBlank(message = "COMMENT_CONTENT_NOT_EMPTY")
    String content;

    @NotNull(message = "COMMENT_COMIC_ID_NOT_EMPTY")
    String comicId;

    String chapterId; // Có thể null nếu comment không thuộc chapter cụ thể

    String parentId; // Có thể null nếu là comment gốc (không phải reply)

    CommentStatus status = CommentStatus.ACTIVE; // Mặc định là ACTIVE
}