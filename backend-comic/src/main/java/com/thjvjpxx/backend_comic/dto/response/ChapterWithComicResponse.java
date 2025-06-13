package com.thjvjpxx.backend_comic.dto.response;

import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * DTO response cho chapter và comic
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChapterWithComicResponse {
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
    List<ChapterResponse> chapters;
}
