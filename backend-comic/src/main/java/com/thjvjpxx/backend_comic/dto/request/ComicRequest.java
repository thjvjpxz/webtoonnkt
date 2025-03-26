package com.thjvjpxx.backend_comic.dto.request;

import java.util.List;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ComicRequest {
    String name;
    String slug;
    String description;
    String author;
    String status;
    String image;
    String thumbUrl;
    String originName;
    List<String> categories;
}
