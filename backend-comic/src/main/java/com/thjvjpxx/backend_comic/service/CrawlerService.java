package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.CrawlerComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface CrawlerService {
    // BaseResponse<?> crawlComic(CrawlerComicRequest request);

    BaseResponse<?> startCrawlComic(CrawlerComicRequest request, String sessionId);

    BaseResponse<?> getCrawlStatus(String sessionId);

    BaseResponse<?> stopCrawlTask(String sessionId);
}
