package com.thjvjpxx.backend_comic.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.model.Category;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublisherComicResponse {

    String id;
    String name;
    String slug;
    String originName;
    String thumbUrl;
    String author;
    ComicStatus status;
    String description;

    // Thống kê
    Integer followersCount;
    Integer viewsCount;
    Integer chaptersCount;
    Double totalRevenue;

    // Metadata
    List<Category> categories;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    // Chapter mới nhất
    String lastChapterId;
    String lastChapterTitle;
    Double lastChapterNumber;
}