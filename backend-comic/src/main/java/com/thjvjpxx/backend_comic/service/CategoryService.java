package com.thjvjpxx.backend_comic.service;

import java.util.List;

import com.thjvjpxx.backend_comic.dto.request.CategoryRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.Category;

/**
 * Service xử lý API quản lý danh mục
 */
public interface CategoryService {
    /**
     * Lấy tất cả danh mục
     * 
     * @param page   Trang hiện tại
     * @param limit  Số lượng mỗi trang
     * @param search Tìm kiếm theo tên
     * @return Response chứa danh sách danh mục
     */
    BaseResponse<List<Category>> getAllCategories(int page, int limit, String search);

    /**
     * Lấy danh mục theo ID
     * 
     * @param id ID danh mục
     * @return Response chứa danh mục
     */
    BaseResponse<Category> getCategoryById(String id);

    /**
     * Tạo danh mục mới
     * 
     * @param category DTO chứa thông tin danh mục
     * @return Response chứa danh mục đã tạo
     */
    BaseResponse<Category> createCategory(CategoryRequest category);

    /**
     * Cập nhật danh mục
     * 
     * @param id       ID danh mục
     * @param category DTO chứa thông tin danh mục
     * @return Response chứa danh mục đã cập nhật
     */
    BaseResponse<Category> updateCategory(String id, CategoryRequest category);

    /**
     * Xóa danh mục
     * 
     * @param id ID danh mục
     * @return Response chứa danh mục đã xóa
     */
    BaseResponse<Category> deleteCategory(String id);
}
