package com.thjvjpxx.backend_comic.dto.otruyen;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTruyenChapter {
    private String filename;
    private String chapter_name;
    private String chapter_title;
    private String chapter_api_data;
}