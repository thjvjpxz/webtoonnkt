package com.thjvjpxx.backend_comic.dto.response;

import java.sql.Timestamp;
import java.util.List;

import com.thjvjpxx.backend_comic.model.Category;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

/**
 * DTO response cho home
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class HomeResponse {
    List<Category> populerCategories;
    List<PopulerToday> populerToday;
    List<PopulerToday> populerWeek;
    List<PopulerToday> populerMonth;
    List<PopulerToday> populerAll;
    List<ComicLastUpdate> comicLastUpdate;

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @NoArgsConstructor
    @AllArgsConstructor
    @SuperBuilder
    public static class PopulerToday {
        String id;
        String thumbUrl;
        String slug;
        String name;
        Long viewCount;
        Double latestChapter;

        public PopulerToday(String id, String thumbUrl, String slug, String name, Long viewCount) {
            this.id = id;
            this.thumbUrl = thumbUrl;
            this.slug = slug;
            this.name = name;
            this.viewCount = viewCount;
        }
    }

    @Data
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChapterHome {
        String id;
        String domainCdn;
        String chapterPath;
        String status;
        Double price;
        Double chapterNumber;
        Timestamp updatedAt;
    }

    @Data
    @EqualsAndHashCode(callSuper = true)
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @SuperBuilder
    public static class ComicLastUpdate extends PopulerToday {
        List<ChapterHome> chapters;
    }

}
