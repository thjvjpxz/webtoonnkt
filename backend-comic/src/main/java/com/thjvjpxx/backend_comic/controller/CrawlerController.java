package com.thjvjpxx.backend_comic.controller;

import org.springframework.web.bind.annotation.*;

import com.thjvjpxx.backend_comic.dto.request.CrawlerComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.CrawlerService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/crawler")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CrawlerController {
    CrawlerService crawlerService;

    @PostMapping("/start")
    public BaseResponse<?> startCrawlComic(@RequestBody CrawlerComicRequest request) {
        String sessionId = UUID.randomUUID().toString();
        return crawlerService.startCrawlComic(request, sessionId);
    }

    @GetMapping("/status/{sessionId}")
    public BaseResponse<?> getCrawlStatus(@PathVariable String sessionId) {
        return crawlerService.getCrawlStatus(sessionId);
    }

    @PostMapping("/stop/{sessionId}")
    public BaseResponse<?> stopCrawlTask(@PathVariable String sessionId) {
        return crawlerService.stopCrawlTask(sessionId);
    }
}
