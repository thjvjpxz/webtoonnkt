package com.thjvjpxx.backend_comic.dto.response;

import java.util.List;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HomeResponse {

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ComicForHome {
        String id;
        String name;
        String slug;
        String thumbUrl;
        String status;
        String rating;
        List<ChapterForHome> chapters;
    }

    @Data
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ChapterForHome {
        String id;
        String name;
        double chapterNumber;
        String thumbUrl;
        String status;
        String domain_cdn;
        String chapter_path;
    }
}
