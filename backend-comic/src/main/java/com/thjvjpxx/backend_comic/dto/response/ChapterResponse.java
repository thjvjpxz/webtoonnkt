package com.thjvjpxx.backend_comic.dto.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thjvjpxx.backend_comic.model.Comic;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChapterResponse {

    String id;
    String title;
    Integer chapterNumber;
    List<DetailChapterResponse> detailChapters;
    Comic comic;
    String createdAt;
    String updatedAt;

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
}
