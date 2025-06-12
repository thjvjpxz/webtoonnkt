package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.CrawlerComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface CrawlerService {
    /**
     * Crawl truyện từ nguồn bên ngoài
     * 
     * @param request Thông tin request
     * @return Kết quả crawl
     */
    BaseResponse<?> crawlComic(CrawlerComicRequest request);
}
