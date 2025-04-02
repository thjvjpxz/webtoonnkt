package com.thjvjpxx.backend_comic.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public class PaginationUtils {
    public static Pageable createPageable(int page, int limit) {
        page = page < 1 ? 1 : page;
        limit = limit < 1 ? 5 : limit;

        int pageForQuery = page == 0 ? 0 : page - 1;
        return PageRequest.of(pageForQuery, limit);
    }
}
