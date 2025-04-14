package com.thjvjpxx.backend_comic.dto.otruyen;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTruyenComic {
    private String _id;
    private String name;
    private String slug;
    private List<String> origin_name;
    private String status;
    private String thumb_url;
    private boolean sub_docquyen;
    private List<OTruyenCategory> category;
    private String updatedAt;
    private List<OTruyenChapter> chaptersLatest;
}