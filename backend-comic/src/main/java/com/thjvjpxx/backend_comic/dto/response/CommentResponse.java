package com.thjvjpxx.backend_comic.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thjvjpxx.backend_comic.enums.CommentStatus;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentResponse {

    String id;
    String content;
    CommentStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    // Thông tin user
    UserInfo user;

    // Thông tin comic
    ComicInfo comic;

    // Thông tin chapter (có thể null)
    ChapterInfo chapter;

    // Thông tin parent comment (có thể null)
    ParentCommentInfo parent;

    // Danh sách reply comments
    List<CommentResponse> replies;

    // Số lượng reply
    Long repliesCount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class UserInfo {
        String id;
        String username;
        String imgUrl;
        Boolean vip;
        LevelInfo level;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class LevelInfo {
        String id;
        Integer levelNumber;
        String name;
        String color;
        String urlGif;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ComicInfo {
        String id;
        String name;
        String slug;
        String thumbUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ChapterInfo {
        String id;
        String title;
        Double chapterNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ParentCommentInfo {
        String id;
        String content;
        UserInfo user;
    }
}