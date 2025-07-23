package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.request.CategoryRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.service.CategoryService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryServiceImpl implements CategoryService {
    CategoryRepository categoryRepository;

    @Override
    public BaseResponse<List<Category>> getAllCategories(int page, int limit, String search) {
        Pageable pageable = PaginationUtils.createPageableWithSort(page, limit, "updatedAt", Sort.Direction.DESC);
        int originalPage = page;

        Page<Category> categories = null;
        if (search != null && !search.isEmpty()) {
            categories = categoryRepository.findByNameContainingOrSlugContaining(search, search, pageable);
        } else {
            categories = categoryRepository.findAll(pageable);
        }
        return BaseResponse.success(
                categories.getContent(),
                originalPage,
                (int) categories.getTotalElements(),
                limit,
                categories.getTotalPages());
    }

    @Override
    public BaseResponse<Category> createCategory(CategoryRequest category) {
        if (category == null) {
            throw new BaseException(ErrorCode.CATEGORY_INVALID);
        }

        validateCategory(category);

        Category newCategory = Category.builder()
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .build();
        Category savedCategory = categoryRepository.save(newCategory);

        return BaseResponse.success(savedCategory);
    }

    private void validateCategory(CategoryRequest category) {
        categoryRepository.findBySlug(category.getSlug()).ifPresent(c -> {
            throw new BaseException(ErrorCode.CATEGORY_DUPLICATE);
        });
        categoryRepository.findByName(category.getName()).ifPresent(c -> {
            throw new BaseException(ErrorCode.CATEGORY_DUPLICATE);
        });
    }

    @Override
    public BaseResponse<Category> updateCategory(String id, CategoryRequest category) {
        ValidationUtils.checkNullId(id);
        if (category == null) {
            throw new BaseException(ErrorCode.CATEGORY_INVALID);
        }

        Category categoryExist = categoryExist(id);

        if (!categoryExist.getSlug().equals(category.getSlug())) {
            validateCategory(category);
        }

        categoryExist.setName(category.getName());
        categoryExist.setSlug(category.getSlug());
        categoryExist.setDescription(category.getDescription());

        Category updatedCategory = categoryRepository.save(categoryExist);
        return BaseResponse.success(updatedCategory);
    }

    @Override
    public BaseResponse<Category> deleteCategory(String id) {
        ValidationUtils.checkNullId(id);
        Category category = categoryExist(id);
        categoryRepository.delete(category);
        return BaseResponse.success(category);
    }

    private Category categoryExist(String id) {
        return categoryRepository.findById(id).orElseThrow(() -> new BaseException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    @Override
    public BaseResponse<Category> getCategoryById(String id) {
        ValidationUtils.checkNullId(id);
        Category category = categoryExist(id);
        return BaseResponse.success(category);
    }

}
