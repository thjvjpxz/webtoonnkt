package com.thjvjpxx.backend_comic.dto.otruyen;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTruyenData {
    private SeoOnPage seoOnPage;
    private List<OTruyenComic> items;
    private OTruyenParams params;
    private String type_list;
    private String APP_DOMAIN_FRONTEND;
    private String APP_DOMAIN_CDN_IMAGE;
}