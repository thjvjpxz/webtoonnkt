package com.thjvjpxx.backend_comic.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PaginationUtils {
    /**
     * Tạo Pageable với sắp xết mặc định
     */
    public static Pageable createPageable(int page, int limit) {
        page = page < 1 ? 1 : page;
        limit = limit < 1 ? 5 : limit;

        int pageForQuery = page == 0 ? 0 : page - 1;
        return PageRequest.of(pageForQuery, limit);
    }

    /**
     * Tạo Pageable với sắp xếp tùy chỉnh
     */
    public static Pageable createPageableWithSort(int page, int limit, String sortBy, Sort.Direction direction) {
        page = page < 1 ? 1 : page;
        limit = limit < 1 ? 5 : limit;

        int pageForQuery = page == 0 ? 0 : page - 1;
        Sort sort = Sort.by(direction, sortBy);
        return PageRequest.of(pageForQuery, limit, sort);
    }
}
