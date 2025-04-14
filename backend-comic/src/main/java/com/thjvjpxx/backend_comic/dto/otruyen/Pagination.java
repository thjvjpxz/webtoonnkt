package com.thjvjpxx.backend_comic.dto.otruyen;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pagination {
    private int totalItems;
    private int totalItemsPerPage;
    private int currentPage;
    private int pageRanges;
}