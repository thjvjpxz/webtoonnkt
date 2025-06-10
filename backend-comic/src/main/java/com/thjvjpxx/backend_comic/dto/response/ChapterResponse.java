package com.thjvjpxx.backend_comic.dto.response;

import java.util.List;

import com.thjvjpxx.backend_comic.enums.ChapterStatus;
import com.thjvjpxx.backend_comic.model.Level;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChapterResponse {

    String id;
    String title;
    Double chapterNumber;
    String comicName;
    ChapterStatus status;
    Double price;
    String domainCdn;
    String chapterPath;
    List<DetailChapterResponse> detailChapters;
    List<ChapterResponseSummary> chapterSummaries;
    String createdAt;
    String updatedAt;
    String publisherName;
    Level publisherLevel;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class DetailChapterResponse {
        String id;
        String imgUrl;
        int orderNumber;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ChapterResponseSummary {
        String id;
        String title;
        Double chapterNumber;
    }
}
