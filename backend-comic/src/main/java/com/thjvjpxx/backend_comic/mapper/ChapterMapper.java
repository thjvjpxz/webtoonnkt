package com.thjvjpxx.backend_comic.mapper;

import java.time.LocalDateTime;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse.DetailChapterResponse;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.DetailChapter;

@Mapper(componentModel = "spring")
public interface ChapterMapper {
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "comicName", source = "comic.name")
    ChapterResponse toChapterResponse(Chapter chapter);

    @Named("localDateTimeToString")
    default String localDateTimeToString(LocalDateTime localDateTime) {
        return localDateTime.toString();
    }

    DetailChapterResponse toDetailChapterResponse(DetailChapter detailChapter);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "comic", ignore = true)
    @Mapping(target = "detailChapters", ignore = true)
    Chapter toChapter(ChapterRequest chapterRequest);

}
