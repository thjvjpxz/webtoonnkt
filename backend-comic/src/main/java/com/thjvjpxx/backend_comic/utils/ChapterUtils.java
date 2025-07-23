package com.thjvjpxx.backend_comic.utils;

import java.util.List;

import org.springframework.stereotype.Component;

import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse.DetailChapterResponse;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Level;

/**
 * Lớp tiện ích để chuyển đổi dữ liệu liên quan đến Chapter
 * Cung cấp các phương thức hỗ trợ biến đổi entity thành response DTO
 */
@Component
public class ChapterUtils {
    
    /**
     * Chuyển đổi entity Chapter thành ChapterResponse DTO
     * 
     * @param chapter Entity Chapter chứa thông tin chương truyện
     * @param detailChapterResponses Danh sách chi tiết các trang của chương
     * @param publisherName Tên nhà xuất bản
     * @param publisherLevel Cấp độ của nhà xuất bản
     * @return ChapterResponse DTO chứa đầy đủ thông tin chương để trả về client
     */
    public ChapterResponse convertChapterToChapterResponse(Chapter chapter,
            List<DetailChapterResponse> detailChapterResponses, String publisherName, Level publisherLevel) {
        return ChapterResponse.builder()
                .id(chapter.getId())
                .title(chapter.getTitle())
                .chapterNumber(chapter.getChapterNumber())
                .comicName(chapter.getComic().getName())
                .status(chapter.getStatus())
                .price(chapter.getPrice())
                .domainCdn(chapter.getDomainCdn())
                .chapterPath(chapter.getChapterPath())
                .detailChapters(detailChapterResponses)
                .createdAt(chapter.getCreatedAt().toString())
                .updatedAt(chapter.getUpdatedAt().toString())
                .publisherName(publisherName)
                .publisherLevel(publisherLevel)
                .build();
    }
}
