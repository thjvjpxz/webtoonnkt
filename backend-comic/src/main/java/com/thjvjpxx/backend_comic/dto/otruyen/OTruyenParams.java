package com.thjvjpxx.backend_comic.dto.otruyen;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTruyenParams {
    private String type_slug;
    private List<String> filterCategory;
    private String sortField;
    private Pagination pagination;
    private int itemsUpdateInDay;
}