package com.thjvjpxx.backend_comic.dto.response;

import java.util.List;

import com.thjvjpxx.backend_comic.model.Category;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class DetailComicResponse {
    String id;
    String name;
    String slug;
    String originName;
    String thumbUrl;
    String author;
    String status;
    int followersCount;
    int viewsCount;
    String description;
    String lastChapterId;
    List<Category> categories;
    List<ChapterSummary> chapters;
    String createdAt;
    String updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @Builder
    public static class ChapterSummary {
        String id;
        String title;
        String domainCdn;
        String chapterPath;
        Double chapterNumber;
        Double price;
        String status;
        String createdAt;
        String updatedAt;
    }
}
