package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.CrawlerComicListRequest;
import com.thjvjpxx.backend_comic.dto.request.CrawlerComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface CrawlerService {
    /**
     * Crawl truyện từ nguồn otruyen
     * 
     * @param request Thông tin request
     * @return Kết quả crawl
     */
    BaseResponse<?> crawlComic(CrawlerComicRequest request);

    /**
     * Crawl truyện từ danh sách OTruyenComic
     * 
     * @param request Thông tin request chứa danh sách comic cần crawl
     * @return Kết quả crawl
     */
    BaseResponse<?> crawlComicFromList(CrawlerComicListRequest request);
}
