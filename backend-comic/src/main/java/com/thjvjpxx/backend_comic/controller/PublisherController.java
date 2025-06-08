package com.thjvjpxx.backend_comic.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.BulkDeleteRequest;
import com.thjvjpxx.backend_comic.dto.request.PublisherChapterRequest;
import com.thjvjpxx.backend_comic.dto.request.PublisherComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherComicResponse;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.User;
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

    // ==================== COMIC MANAGEMENT ====================

    @PostMapping("/comics")
    public BaseResponse<Comic> createComic(
            @Valid @RequestPart("data") PublisherComicRequest request,
            @RequestPart(value = "cover", required = false) MultipartFile coverFile) {
        String currentUserId = securityUtils.getCurrentUserId();
        return publisherService.createComic(currentUserId, request, coverFile);
    }

    @GetMapping("/comics")
    public BaseResponse<List<PublisherComicResponse>> getMyComics(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String currentUserId = securityUtils.getCurrentUserId();
        return publisherService.getMyComics(currentUserId, search, status, category, page, size);
    }

    @GetMapping("/comics/{comicId}")
    public BaseResponse<PublisherComicResponse> getMyComic(
            @AuthenticationPrincipal User publisher,
            @PathVariable String comicId) {
        return publisherService.getMyComic(publisher, comicId);
    }

    @PutMapping("/comics/{comicId}")
    public BaseResponse<Comic> updateComic(
            @PathVariable String comicId,
            @Valid @RequestPart("data") PublisherComicRequest request,
            @RequestPart(value = "cover", required = false) MultipartFile coverFile) {
        String currentUserId = securityUtils.getCurrentUserId();
        return publisherService.updateComic(currentUserId, comicId, request, coverFile);
    }

    @DeleteMapping("/comics/{comicId}")
    public BaseResponse<Void> deleteComic(
            @PathVariable String comicId) {
        String currentUserId = securityUtils.getCurrentUserId();
        return publisherService.deleteComic(currentUserId, comicId);
    }

    // ==================== CHAPTER MANAGEMENT ====================

    @PostMapping("/comics/{comicId}/chapters")
    public BaseResponse<Chapter> createChapter(
            @AuthenticationPrincipal User publisher,
            @PathVariable String comicId,
            @Valid @RequestBody PublisherChapterRequest request) {
        return publisherService.createChapter(publisher, comicId, request);
    }

    @PostMapping(value = "/comics/{comicId}/chapters/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public BaseResponse<Chapter> createChapterWithImages(
            @AuthenticationPrincipal User publisher,
            @PathVariable String comicId,
            @Valid @RequestPart("data") PublisherChapterRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return publisherService.createChapterWithImages(publisher, comicId, request, images);
    }

    @GetMapping("/comics/{comicId}/chapters")
    public BaseResponse<List<Chapter>> getChaptersByComic(
            @AuthenticationPrincipal User publisher,
            @PathVariable String comicId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return publisherService.getChaptersByComic(publisher, comicId, page, limit);
    }

    @GetMapping("/chapters")
    public BaseResponse<?> getAllChapters(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String comicId) {
        String currentUserId = securityUtils.getCurrentUserId();
        return publisherService.getAllChapters(currentUserId, page, limit, search, comicId);
    }

    @PutMapping("/chapters/{chapterId}")
    public BaseResponse<Chapter> updateChapter(
            @AuthenticationPrincipal User publisher,
            @PathVariable String chapterId,
            @Valid @RequestBody PublisherChapterRequest request) {
        return publisherService.updateChapter(publisher, chapterId, request);
    }

    @PutMapping(value = "/chapters/{chapterId}/upload", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public BaseResponse<Chapter> updateChapterWithImages(
            @AuthenticationPrincipal User publisher,
            @PathVariable String chapterId,
            @Valid @RequestPart("data") PublisherChapterRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return publisherService.updateChapterWithImages(publisher, chapterId, request, images);
    }

    @DeleteMapping("/chapters/{chapterId}")
    public BaseResponse<Void> deleteChapter(
            @AuthenticationPrincipal User publisher,
            @PathVariable String chapterId) {
        return publisherService.deleteChapter(publisher, chapterId);
    }

    @DeleteMapping("/chapters/bulk")
    public BaseResponse<Void> deleteMultipleChapters(
            @AuthenticationPrincipal User publisher,
            @Valid @RequestBody BulkDeleteRequest request) {
        return publisherService.deleteMultipleChapters(publisher, request.getIds());
    }

    @PostMapping("/chapters/{chapterId}/reorder")
    public BaseResponse<Void> reorderChapter(
            @AuthenticationPrincipal User publisher,
            @PathVariable String chapterId,
            @RequestParam Double newChapterNumber) {
        return publisherService.reorderChapter(publisher, chapterId, newChapterNumber);
    }

    @GetMapping("/chapters/{chapterId}/stats")
    public BaseResponse<ChapterStatsResponse> getChapterStats(
            @AuthenticationPrincipal User publisher,
            @PathVariable String chapterId) {
        return publisherService.getChapterStats(publisher, chapterId);
    }
}