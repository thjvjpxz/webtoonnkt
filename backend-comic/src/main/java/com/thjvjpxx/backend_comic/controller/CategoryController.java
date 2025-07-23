package com.thjvjpxx.backend_comic.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.request.CategoryRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.service.CategoryService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    /**
     * Lấy tất cả danh mục
     * GET /categories
     * 
     * @param page   Trang hiện tại
     * @param limit  Số lượng mỗi trang
     * @param search Tìm kiếm theo tên
     * @return Response chứa danh sách danh mục
     */
    @GetMapping
    public BaseResponse<List<Category>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String search) {
        return categoryService.getAllCategories(page, limit, search);
    }

    /**
     * Tạo danh mục mới
     * POST /categories
     * 
     * @param category DTO chứa thông tin danh mục
     * @return Response chứa danh mục đã tạo
     */
    @PostMapping
    public BaseResponse<Category> createCategory(@Valid @RequestBody CategoryRequest category) {
        return categoryService.createCategory(category);
    }

    /**
     * Cập nhật danh mục
     * PUT /categories/{id}
     * 
     * @param id       ID danh mục
     * @param category DTO chứa thông tin danh mục
     * @return Response chứa danh mục đã cập nhật
     */
    @PutMapping("/{id}")
    public BaseResponse<Category> updateCategory(@Valid @PathVariable String id,
            @RequestBody CategoryRequest category) {
        return categoryService.updateCategory(id, category);
    }

    /**
     * Xóa danh mục
     * DELETE /categories/{id}
     * 
     * @param id ID danh mục
     * @return Response chứa danh mục đã xóa
     */
    @DeleteMapping("/{id}")
    public BaseResponse<Category> deleteCategory(@PathVariable String id) {
        return categoryService.deleteCategory(id);
    }

    /**
     * Lấy danh mục theo ID
     * GET /categories/{id}
     * 
     * @param id ID danh mục
     * @return Response chứa danh mục
     */
    @GetMapping("/{id}")
    public BaseResponse<Category> getCategoryById(@PathVariable String id) {
        return categoryService.getCategoryById(id);
    }
}
