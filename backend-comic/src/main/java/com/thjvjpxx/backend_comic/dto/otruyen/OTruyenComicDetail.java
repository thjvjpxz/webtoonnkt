package com.thjvjpxx.backend_comic.dto.otruyen;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

/**
 * DTO cho comic detail của OTruyen
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTruyenComicDetail {
    private ComicDetailData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComicDetailData {
        private ComicItem item;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ComicItem {
        String name;
        String slug;
        List<String> origin_name;
        String status;
        String content;
        String thumb_url;
        List<String> author;
        List<OTruyenCategory> category;
        List<ChapterServer> chapters;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChapterServer {
        private List<OTruyenChapter> server_data;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class OTruyenCategory {
        String name;
        String slug;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class OTruyenChapter {
        String filename;
        String chapter_name;
        String chapter_title;
        String chapter_api_data;
    }
}