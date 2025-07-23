package com.thjvjpxx.backend_comic.controller;

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

import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.ComicService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/comics")
public class ComicController {
    ComicService comicService;

    /**
     * Lấy tất cả comic
     * GET /comics
     * 
     * @param page     Trang hiện tại
     * @param limit    Số lượng mỗi trang
     * @param search   Tìm kiếm theo tên
     * @param status   Trạng thái
     * @param category ID danh mục
     * @return Response chứa danh sách comic
     */
    @GetMapping
    public BaseResponse<?> getAllComics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        return comicService.getAllComics(page, limit, search, status, category);
    }

    /**
     * Tạo comic mới
     * POST /comics
     * 
     * @param comicRequest DTO chứa thông tin comic
     * @param cover        File ảnh cover
     * @return Response chứa comic đã tạo
     */
    @PostMapping
    public BaseResponse<?> createComic(
            @Valid @RequestPart("data") ComicRequest comicRequest,
            @RequestPart(value = "cover", required = false) MultipartFile cover) {
        return comicService.createComic(comicRequest, cover, null);
    }

    /**
     * Cập nhật comic
     * PUT /comics/{id}
     * 
     * @param id           ID comic
     * @param comicRequest DTO chứa thông tin comic
     * @param cover        File ảnh cover
     * @return Response chứa comic đã cập nhật
     */
    @PutMapping(value = "/{id}")
    public BaseResponse<?> updateComic(@PathVariable String id,
            @Valid @RequestPart("data") ComicRequest comicRequest,
            @RequestPart(value = "cover", required = false) MultipartFile cover) {
        return comicService.updateComic(id, comicRequest, cover, null);
    }

    /**
     * Xóa comic
     * DELETE /comics/{id}
     * 
     * @param id ID comic
     * @return Response chứa comic đã xóa
     */
    @DeleteMapping("/{id}")
    public BaseResponse<?> deleteComic(@PathVariable String id) {
        return comicService.deleteComic(id, null);
    }
}
