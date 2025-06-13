package com.thjvjpxx.backend_comic.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
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

import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.service.ChapterService;
import com.thjvjpxx.backend_comic.service.ComicService;
import com.thjvjpxx.backend_comic.service.PublisherService;
import com.thjvjpxx.backend_comic.utils.SecurityUtils;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("/publisher")
@Validated
public class PublisherController {

    PublisherService publisherService;
    SecurityUtils securityUtils;
    ComicService comicService;
    ChapterService chapterService;

    // ==================== COMIC MANAGEMENT ====================
    @GetMapping("/comics")
    public BaseResponse<?> getMyComics(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        User currentUser = securityUtils.getCurrentUser();
        return publisherService.getMyComics(currentUser, search, status, category, page, limit);
    }

    @PostMapping(value = "/comics")
    public BaseResponse<?> createComic(
            @Valid @RequestPart("data") ComicRequest comicRequest,
            @RequestPart(value = "cover", required = false) MultipartFile cover) {
        User currentUser = securityUtils.getCurrentUser();
        return comicService.createComic(comicRequest, cover, currentUser);
    }

    @PutMapping(value = "/comics/{comicId}")
    public BaseResponse<?> updateComic(@PathVariable String comicId,
            @Valid @RequestPart("data") ComicRequest comicRequest,
            @RequestPart(value = "cover", required = false) MultipartFile cover) {
        User currentUser = securityUtils.getCurrentUser();
        return comicService.updateComic(comicId, comicRequest, cover, currentUser);
    }

    @DeleteMapping("/comics/{comicId}")
    public BaseResponse<?> deleteComic(@PathVariable String comicId) {
        User currentUser = securityUtils.getCurrentUser();
        return comicService.deleteComic(comicId, currentUser);
    }

    // ==================== CHAPTER MANAGEMENT ====================
    @GetMapping("/chapters")
    public BaseResponse<?> getAllChapters(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String comicId) {
        User currentUser = securityUtils.getCurrentUser();
        return publisherService.getAllChapters(currentUser, page, limit, search, comicId);
    }

    @PostMapping("/chapters")
    public BaseResponse<?> createChapter(
            @Valid @RequestPart("data") ChapterRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        User currentUser = securityUtils.getCurrentUser();
        return chapterService.createChapter(request, files, currentUser);
    }

    @PutMapping("/chapters/{chapterId}")
    public BaseResponse<?> updateChapterWithImages(
            @PathVariable String chapterId,
            @Valid @RequestPart("data") ChapterRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        User currentUser = securityUtils.getCurrentUser();
        return chapterService.updateChapter(chapterId, request, files, currentUser);
    }

    @DeleteMapping("/chapters/{chapterId}")
    public BaseResponse<?> deleteChapter(
            @PathVariable String chapterId) {
        User currentUser = securityUtils.getCurrentUser();
        return chapterService.deleteChapter(chapterId, currentUser);
    }
}