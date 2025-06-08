package com.thjvjpxx.backend_comic.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.DetailChapter;

@Mapper(componentModel = "spring")
public interface ChapterMapper {
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "comicName", source = "comic.name")
    @Mapping(target = "chapterSummaries", ignore = true)
    @Mapping(target = "detailChapters", source = "detailChapters", qualifiedByName = "mapDetailChapters")
    ChapterResponse toChapterResponse(Chapter chapter);

    @Named("mapDetailChapters")
    default List<ChapterResponse.DetailChapterResponse> mapDetailChapters(List<DetailChapter> detailChapters) {
        if (detailChapters == null) {
            return null;
        }
        return detailChapters.stream()
                .map(detail -> ChapterResponse.DetailChapterResponse.builder()
                        .id(detail.getId())
                        .imgUrl(detail.getImgUrl())
                        .orderNumber(detail.getOrderNumber())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }

    @Named("localDateTimeToString")
    default String localDateTimeToString(LocalDateTime localDateTime) {
        return localDateTime.toString();
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "comic", ignore = true)
    @Mapping(target = "detailChapters", ignore = true)
    @Mapping(target = "chapterPath", ignore = true)
    @Mapping(target = "domainCdn", ignore = true)
    Chapter toChapter(ChapterRequest chapterRequest);

}
