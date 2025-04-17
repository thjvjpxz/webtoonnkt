package com.thjvjpxx.backend_comic.dto.otruyen;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTruyenResponse {
    private OTruyenData data;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OTruyenData {
        private List<OTruyenComic> items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OTruyenComic {
        private String slug;
    }
}