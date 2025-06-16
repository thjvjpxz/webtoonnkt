package com.thjvjpxx.backend_comic.dto.response;

import java.util.List;

import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.model.Category;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * DTO response cho comic
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ComicResponse {
    String id;
    String name;
    String slug;
    String originName;
    String thumbUrl;
    String author;
    ComicStatus status;
    int followersCount;
    int viewsCount;
    String description;
    String publisherUserName;
    List<Category> categories;
    String createdAt;
    String updatedAt;
}
