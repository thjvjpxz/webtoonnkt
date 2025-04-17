package com.thjvjpxx.backend_comic.dto.websocket;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.thjvjpxx.backend_comic.enums.CrawlerStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrawlerProgressMessage {
    private String sessionId;
    private CrawlerStatus status;
    private int totalComicsProcessed;
    private int totalSuccessfulComics;
    private int currentPage;
    private int totalPages;
    private String currentComic;
    private int currentComicChaptersProcessed;

    @Builder.Default
    private Map<String, Object> lastCompletedChapter = new HashMap<>();

    @Builder.Default
    private List<Map<String, Object>> errors = new ArrayList<>();

    public void addError(String slug, String errorMessage) {
        Map<String, Object> error = new HashMap<>();
        error.put("comicSlug", slug);
        error.put("error", errorMessage);
        this.errors.add(error);
    }

    public void setLastCompletedChapter(Map<String, Object> chapterInfo) {
        this.lastCompletedChapter = chapterInfo;
    }
}