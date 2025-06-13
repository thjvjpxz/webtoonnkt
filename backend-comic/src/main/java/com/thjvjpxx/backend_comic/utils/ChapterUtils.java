package com.thjvjpxx.backend_comic.utils;

import java.util.List;

import org.springframework.stereotype.Component;

import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse.DetailChapterResponse;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Level;

@Component
public class ChapterUtils {
    public ChapterResponse convertChapterToChapterResponse(Chapter chapter,
            List<DetailChapterResponse> detailChapterResponses, String publisherName, Level publisherLevel) {
        return ChapterResponse.builder()
                .id(chapter.getId())
                .title(chapter.getTitle())
                .chapterNumber(chapter.getChapterNumber())
                .comicName(chapter.getComic().getName())
                .status(chapter.getStatus())
                .price(chapter.getPrice())
                .domainCdn(chapter.getDomainCdn())
                .chapterPath(chapter.getChapterPath())
                .detailChapters(detailChapterResponses)
                .createdAt(chapter.getCreatedAt().toString())
                .updatedAt(chapter.getUpdatedAt().toString())
                .publisherName(publisherName)
                .publisherLevel(publisherLevel)
                .build();
    }
}
