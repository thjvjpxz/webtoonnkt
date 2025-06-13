package com.thjvjpxx.backend_comic.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.request.CrawlerComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.CrawlerService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("/crawler")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CrawlerController {
    CrawlerService crawlerService;

    /**
     * Bắt đầu crawl comic
     * POST /crawler
     * 
     * @param request DTO chứa thông tin comic
     * @return Response chứa comic đã crawl
     */
    @PostMapping
    public BaseResponse<?> startCrawlComic(@RequestBody CrawlerComicRequest request) {
        return crawlerService.crawlComic(request);
    }

}
