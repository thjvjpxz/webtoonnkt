package com.thjvjpxx.backend_comic.dto.otruyen;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO cho chapter detail của OTruyen
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTruyenChapterDetail {
    private ChapterDetailData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChapterDetailData {
        private String domain_cdn;
        private ChapterItem item;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChapterItem {
        private String comic_name;
        private String chapter_path;
        private List<ChapterImage> chapter_image;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChapterImage {
        private int image_page;
        private String image_file;
    }
}