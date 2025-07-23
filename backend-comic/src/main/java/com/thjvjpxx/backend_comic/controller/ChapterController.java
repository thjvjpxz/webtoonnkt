package com.thjvjpxx.backend_comic.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.ChapterService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chapters")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChapterController {
    ChapterService chapterService;

    /**
     * Lấy tất cả chương
     * GET /chapters
     * 
     * @param page    Trang hiện tại
     * @param limit   Số lượng mỗi trang
     * @param search  Tìm kiếm theo tên
     * @param comicId ID comic
     * @return Response chứa danh sách chương
     */
    @GetMapping
    public BaseResponse<?> getAllChapters(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String comicId) {
        return chapterService.getAllChapters(page, limit, search, comicId);
    }

    /**
     * Tạo chương mới
     * POST /chapters
     * 
     * @param chapterRequest DTO chứa thông tin chương
     * @param files          Danh sách file ảnh
     * @return Response chứa chương đã tạo
     */
    @PostMapping
    public BaseResponse<?> createChapter(
            @Valid @RequestPart("data") ChapterRequest chapterRequest,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        return chapterService.createChapter(chapterRequest, files, null);
    }

    /**
     * Cập nhật chương
     * PUT /chapters/{id}
     * 
     * @param id             ID chương
     * @param chapterRequest DTO chứa thông tin chương
     * @param files          Danh sách file ảnh
     * @return Response chứa chương đã cập nhật
     */
    @PutMapping("/{id}")
    public BaseResponse<?> updateChapter(@PathVariable String id,
            @Valid @RequestPart("data") ChapterRequest chapterRequest,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        return chapterService.updateChapter(id, chapterRequest, files, null);
    }

    /**
     * Xóa chương
     * DELETE /chapters/{id}
     * 
     * @param id ID chương
     * @return Response chứa chương đã xóa
     */
    @DeleteMapping("/{id}")
    public BaseResponse<?> deleteChapter(@PathVariable String id) {
        return chapterService.deleteChapter(id, null);
    }

}
