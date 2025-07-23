package com.thjvjpxx.backend_comic.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.request.CrawlerComicListRequest;
import com.thjvjpxx.backend_comic.dto.request.CrawlerComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.CrawlerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/crawler")
public class CrawlerController {
    private final CrawlerService crawlerService;

    /**
     * Bắt đầu crawl comic từ page x đến y
     * POST /crawler
     * 
     * @param request DTO chứa thông tin page range
     * @return Response chứa kết quả crawl
     */
    @PostMapping
    public BaseResponse<?> startCrawlComic(@RequestBody CrawlerComicRequest request) {
        return crawlerService.crawlComic(request);
    }

    /**
     * Bắt đầu crawl comic từ danh sách OTruyenComic
     * POST /crawler/from-list
     * 
     * @param request DTO chứa danh sách comic cần crawl
     * @return Response chứa kết quả crawl
     */
    @PostMapping("/from-list")
    public BaseResponse<?> startCrawlComicFromList(@RequestBody CrawlerComicListRequest request) {
        return crawlerService.crawlComicFromList(request);
    }
}
