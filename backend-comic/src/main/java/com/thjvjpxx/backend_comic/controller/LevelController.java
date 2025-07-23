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

import com.thjvjpxx.backend_comic.dto.request.LevelRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.LevelService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/levels")
public class LevelController {
    LevelService levelService;

    /**
     * Lấy danh sách level
     * GET /levels
     * 
     * @param page   Số trang
     * @param limit  Số lượng trong 1 trang
     * @param search Từ khóa tìm kiếm
     * @return Response chứa danh sách level
     */
    @GetMapping
    public BaseResponse<?> getLevels(@RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) String search) {
        return levelService.getLevelWithPagination(page, limit, search);
    }

    /**
     * Tạo level mới
     * POST /levels
     * 
     * @param request DTO chứa thông tin level
     * @param file    File ảnh
     * @return Response chứa level đã tạo
     */
    @PostMapping
    public BaseResponse<?> createLevel(
            @Valid @RequestPart("data") LevelRequest request,
            @RequestPart(value = "cover", required = false) MultipartFile file) {
        return levelService.createLevel(request, file);
    }

    /**
     * Cập nhật level
     * PUT /levels/{id}
     * 
     * @param id      ID level
     * @param request DTO chứa thông tin level
     * @param file    File ảnh
     * @return Response chứa level đã cập nhật
     */
    @PutMapping(value = "/{id}")
    public BaseResponse<?> updateLevel(@PathVariable String id,
            @Valid @RequestPart("data") LevelRequest request,
            @RequestPart(value = "cover", required = false) MultipartFile file) {
        return levelService.updateLevel(id, request, file);
    }

    /**
     * Xóa level
     * DELETE /levels/{id}
     * 
     * @param id ID level
     * @return Response chứa thông báo thành công
     */
    @DeleteMapping("/{id}")
    public BaseResponse<?> deleteLevel(@PathVariable String id) {
        return levelService.deleteLevel(id);
    }

    /**
     * Lấy level theo type
     * GET /levels/by-type
     * 
     * @param levelTypeId ID level type
     * @return Response chứa danh sách level
     */
    @GetMapping("/by-type")
    public BaseResponse<?> getLevelByType(@RequestParam String levelTypeId) {
        return levelService.getLevelByType(levelTypeId);
    }
}
