package com.thjvjpxx.backend_comic.controller;

import java.util.List;

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

import com.thjvjpxx.backend_comic.dto.request.PublisherChapterRequest;
import com.thjvjpxx.backend_comic.dto.request.PublisherComicRequest;
import com.thjvjpxx.backend_comic.dto.request.WithdrawalRequestDto;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherComicResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherStatsResponse;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.WithdrawalRequest;
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

    // ==================== DASHBOARD ====================

    @GetMapping("/stats")
    public BaseResponse<PublisherStatsResponse> getPublisherStats(
            @AuthenticationPrincipal User publisher) {
        return publisherService.getPublisherStats(publisher);
    }

    @GetMapping("/balance")
    public BaseResponse<Double> getAvailableBalance(
            @AuthenticationPrincipal User publisher) {
        return publisherService.getAvailableBalance(publisher);
    }

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

    @GetMapping("/comics/{comicId}/chapters")
    public BaseResponse<List<Chapter>> getChaptersByComic(
            @AuthenticationPrincipal User publisher,
            @PathVariable String comicId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return publisherService.getChaptersByComic(publisher, comicId, page, limit);
    }

    @PutMapping("/chapters/{chapterId}")
    public BaseResponse<Chapter> updateChapter(
            @AuthenticationPrincipal User publisher,
            @PathVariable String chapterId,
            @Valid @RequestBody PublisherChapterRequest request) {
        return publisherService.updateChapter(publisher, chapterId, request);
    }

    @DeleteMapping("/chapters/{chapterId}")
    public BaseResponse<Void> deleteChapter(
            @AuthenticationPrincipal User publisher,
            @PathVariable String chapterId) {
        return publisherService.deleteChapter(publisher, chapterId);
    }

    // ==================== WITHDRAWAL ====================

    @PostMapping("/withdrawal")
    public BaseResponse<WithdrawalRequest> createWithdrawalRequest(
            @AuthenticationPrincipal User publisher,
            @Valid @RequestBody WithdrawalRequestDto request) {
        return publisherService.createWithdrawalRequest(publisher, request);
    }

    @GetMapping("/withdrawal")
    public BaseResponse<List<WithdrawalRequest>> getMyWithdrawalRequests(
            @AuthenticationPrincipal User publisher,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return publisherService.getMyWithdrawalRequests(publisher, page, limit);
    }
}