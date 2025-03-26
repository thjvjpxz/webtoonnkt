package com.thjvjpxx.backend_comic.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thjvjpxx.backend_comic.dto.request.CategoryRequest;
import com.thjvjpxx.backend_comic.model.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Category toCategory(CategoryRequest category);
}
