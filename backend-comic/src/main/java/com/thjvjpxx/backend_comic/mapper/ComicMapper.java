package com.thjvjpxx.backend_comic.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.model.Comic;

@Mapper(componentModel = "spring")
public interface ComicMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "followersCount", ignore = true)
    @Mapping(target = "viewsCount", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "folderId", ignore = true)
    Comic toComic(ComicRequest comicRequest);
}
