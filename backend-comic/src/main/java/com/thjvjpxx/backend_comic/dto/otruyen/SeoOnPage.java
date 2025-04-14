package com.thjvjpxx.backend_comic.dto.otruyen;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeoOnPage {
    private String titleHead;
    private String descriptionHead;
    private String og_type;
    private List<String> og_image;
}