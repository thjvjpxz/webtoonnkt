package com.thjvjpxx.backend_comic.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
@RequestMapping("/level")
public class LevelController {
    LevelService levelService;

    @GetMapping
    public BaseResponse<?> getLevels() {
        return levelService.getAllLevel();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponse<?> createLevel(@Valid @RequestPart LevelRequest request,
            @RequestPart(required = false) MultipartFile file) {
        return levelService.createLevel(request, file);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BaseResponse<?> updateLevel(@PathVariable String id, @Valid @RequestPart LevelRequest request,
            @RequestPart(required = false) MultipartFile file) {
        return levelService.updateLevel(id, request, file);
    }

    @DeleteMapping("/{id}")
    public BaseResponse<?> deleteLevel(@PathVariable String id) {
        return levelService.deleteLevel(id);
    }
}
