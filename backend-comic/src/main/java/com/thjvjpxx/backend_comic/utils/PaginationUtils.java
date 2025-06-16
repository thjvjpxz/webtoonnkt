package com.thjvjpxx.backend_comic.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Lớp tiện ích cho các thao tác phân trang
 */
public class PaginationUtils {
    /**
     * Tạo Pageable với sắp xết mặc định
     * 
     * @param page  Trang hiện tại
     * @param limit Số lượng mỗi trang
     * @return Pageable với sắp xết mặc định
     */
    public static Pageable createPageable(int page, int limit) {
        page = page < 1 ? 1 : page;
        limit = limit < 1 ? 5 : limit;

        int pageForQuery = page == 0 ? 0 : page - 1;
        return PageRequest.of(pageForQuery, limit);
    }

    /**
     * Tạo Pageable với sắp xếp tùy chỉnh
     * 
     * @param page      Trang hiện tại
     * @param limit     Số lượng mỗi trang
     * @param sortBy    Tên trường sắp xết
     * @param direction Hướng sắp xết (ASC hoặc DESC)
     * @return Pageable với sắp xết tùy chỉnh
     */
    public static Pageable createPageableWithSort(int page, int limit, String sortBy, Sort.Direction direction) {
        page = page < 1 ? 1 : page;
        limit = limit < 1 ? 5 : limit;

        int pageForQuery = page == 0 ? 0 : page - 1;
        Sort sort = Sort.by(direction, sortBy);
        return PageRequest.of(pageForQuery, limit, sort);
    }
}
