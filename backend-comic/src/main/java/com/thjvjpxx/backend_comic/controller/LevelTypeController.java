package com.thjvjpxx.backend_comic.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.request.LevelTypeRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.LevelTypeService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/level-type")
public class LevelTypeController {
    LevelTypeService levelTypeService;

    @GetMapping
    public BaseResponse<?> getAllLevelType() {
        return levelTypeService.getAllLevelType();
    }

    @PostMapping
    public BaseResponse<?> createLevelType(@Valid @RequestBody LevelTypeRequest request) {
        return levelTypeService.createLevelType(request);
    }

    @PutMapping("/{id}")
    public BaseResponse<?> updateLevelType(@PathVariable String id, @Valid @RequestBody LevelTypeRequest request) {
        return levelTypeService.updateLevelType(id, request);
    }

    @DeleteMapping("/{id}")
    public BaseResponse<?> deleteLevelType(@PathVariable String id) {
        return levelTypeService.deleteLevelType(id);
    }
}
