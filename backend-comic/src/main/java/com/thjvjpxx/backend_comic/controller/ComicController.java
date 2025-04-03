package com.thjvjpxx.backend_comic.controller;

import java.util.List;

import org.springframework.http.MediaType;
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

import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.service.ComicService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/comics")
@Slf4j
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

    @GetMapping("/{id}/chapters")
    public BaseResponse<List<ChapterResponse>> getAllChapters(
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        return comicService.getAllChapters(page, limit, search, status, id);
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public BaseResponse<Comic> createComic(
            @Valid @RequestPart("data") ComicRequest comicRequest,
            @RequestPart(value = "cover", required = false) MultipartFile cover) {
        return comicService.createComic(comicRequest, cover);
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public BaseResponse<Comic> updateComic(@PathVariable String id,
            @Valid @RequestPart("data") ComicRequest comicRequest,
            @RequestPart(value = "cover", required = false) MultipartFile cover) {
        return comicService.updateComic(id, comicRequest, cover);
    }

    @DeleteMapping("/{id}")
    public BaseResponse<Comic> deleteComic(@PathVariable String id) {
        return comicService.deleteComic(id);
    }
}
