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

import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.Comic;
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

    @GetMapping
    public BaseResponse<List<Comic>> getAllComics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        return comicService.getAllComics(page, limit, search, status, category);
    }

    @PostMapping
    public BaseResponse<Comic> createComic(@Valid @RequestBody ComicRequest comicRequest) {
        return comicService.createComic(comicRequest);
    }

    @PutMapping("/{id}")
    public BaseResponse<Comic> updateComic(@Valid @PathVariable String id,
            @RequestBody ComicRequest comicRequest) {
        return comicService.updateComic(id, comicRequest);
    }

    @DeleteMapping("/{id}")
    public BaseResponse<Comic> deleteComic(@PathVariable String id) {
        return comicService.deleteComic(id);
    }
}
