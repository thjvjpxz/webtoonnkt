package com.thjvjpxx.backend_comic.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse.DetailChapterResponse;
import com.thjvjpxx.backend_comic.model.Chapter;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChapterMapper {
    public ChapterResponse toChapterResponse(Chapter chapter) {
        if (chapter == null) {
            return null;
        }

        ChapterResponse chapterResponse = ChapterResponse.builder()
                .id(chapter.getId())
                .title(chapter.getTitle())
                .chapterNumber(chapter.getChapterNumber())
                .comic(chapter.getComic())
                .createdAt(chapter.getCreatedAt().toString())
                .updatedAt(chapter.getUpdatedAt().toString())
                .build();

        List<DetailChapterResponse> detailChapterResponses = chapter.getDetailChapters().stream()
                .map(detailChapter -> DetailChapterResponse.builder()
                        .id(detailChapter.getId())
                        .imgUrl(detailChapter.getImgUrl())
                        .orderNumber(detailChapter.getOrderNumber())
                        .build())
                .collect(Collectors.toList());

        chapterResponse.setDetailChapters(detailChapterResponses);

        return chapterResponse;
    }
}
