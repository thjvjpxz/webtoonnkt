package com.thjvjpxx.backend_comic.service;

import java.util.List;

import com.thjvjpxx.backend_comic.dto.request.CategoryRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.Category;

public interface CategoryService {
    BaseResponse<List<Category>> getAllCategories(int page, int limit, String search);

    BaseResponse<Category> createCategory(CategoryRequest category);

    BaseResponse<Category> updateCategory(String id, CategoryRequest category);

    BaseResponse<Category> deleteCategory(String id);
}
