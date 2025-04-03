package com.thjvjpxx.backend_comic.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thjvjpxx.backend_comic.dto.request.LevelRequest;
import com.thjvjpxx.backend_comic.model.Level;

@Mapper(componentModel = "spring")
public interface LevelMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "levelType", ignore = true)
    Level toLevel(LevelRequest request);
}
