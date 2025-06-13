package com.thjvjpxx.backend_comic.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
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
import com.thjvjpxx.backend_comic.dto.response.PublisherPersonalStatsResponse;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.service.ChapterService;
import com.thjvjpxx.backend_comic.service.ComicService;
import com.thjvjpxx.backend_comic.service.PublisherPersonalStatsService;
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
    PublisherPersonalStatsService publisherPersonalStatsService;

    // ==================== PERSONAL STATISTICS ====================

    /**
     * Lấy thống kê cá nhân
     * GET /publisher/stats/personal
     * 
     * @return Response chứa thống kê cá nhân
     */
    @GetMapping("/stats/personal")
    public BaseResponse<PublisherPersonalStatsResponse> getPersonalStats() {
        User currentUser = securityUtils.getCurrentUser();
        PublisherPersonalStatsResponse stats = publisherPersonalStatsService.getPersonalStats(currentUser);

        return BaseResponse.success(stats, "Lấy thống kê cá nhân thành công");
    }

    /**
     * Lấy thống kê cá nhân theo khoảng thời gian
     * GET /publisher/stats/personal/range
     * 
     * @param startDate Ngày bắt đầu
     * @param endDate   Ngày kết thúc
     * @return Response chứa thống kê cá nhân theo khoảng thời gian
     */
    @GetMapping("/stats/personal/range")
    public BaseResponse<PublisherPersonalStatsResponse> getPersonalStatsInRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        User currentUser = securityUtils.getCurrentUser();
        PublisherPersonalStatsResponse stats = publisherPersonalStatsService.getPersonalStatsInDateRange(currentUser,
                startDate, endDate);

        return BaseResponse.success(stats, "Lấy thống kê cá nhân theo khoảng thời gian thành công");
    }

    // ==================== COMIC MANAGEMENT ====================

    /**
     * Lấy danh sách comic của user
     * GET /publisher/comics
     * 
     * @param page     Trang hiện tại
     * @param limit    Số lượng mỗi trang
     * @param search   Từ khóa tìm kiếm
     * @param status   Trạng thái comic
     * @param category ID danh mục
     * @return Response chứa danh sách comic của user
     */
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

    /**
     * Tạo comic mới
     * POST /publisher/comics
     * 
     * @param comicRequest Dữ liệu comic
     * @param cover        Ảnh bìa
     * @return Response chứa comic đã tạo
     */
    @PostMapping(value = "/comics")
    public BaseResponse<?> createComic(
            @Valid @RequestPart("data") ComicRequest comicRequest,
            @RequestPart(value = "cover", required = false) MultipartFile cover) {
        User currentUser = securityUtils.getCurrentUser();
        return comicService.createComic(comicRequest, cover, currentUser);
    }

    /**
     * Cập nhật comic
     * PUT /publisher/comics/{comicId}
     * 
     * @param comicId      ID comic
     * @param comicRequest Dữ liệu comic
     * @param cover        Ảnh bìa
     * @return Response chứa comic đã cập nhật
     */
    @PutMapping(value = "/comics/{comicId}")
    public BaseResponse<?> updateComic(@PathVariable String comicId,
            @Valid @RequestPart("data") ComicRequest comicRequest,
            @RequestPart(value = "cover", required = false) MultipartFile cover) {
        User currentUser = securityUtils.getCurrentUser();
        return comicService.updateComic(comicId, comicRequest, cover, currentUser);
    }

    /**
     * Xóa comic
     * DELETE /publisher/comics/{comicId}
     * 
     * @param comicId ID comic
     * @return Response chứa comic đã xóa
     */
    @DeleteMapping("/comics/{comicId}")
    public BaseResponse<?> deleteComic(@PathVariable String comicId) {
        User currentUser = securityUtils.getCurrentUser();
        return comicService.deleteComic(comicId, currentUser);
    }

    // ==================== CHAPTER MANAGEMENT ====================

    /**
     * Lấy danh sách chapter của user
     * GET /publisher/chapters
     * 
     * @param page    Trang hiện tại
     * @param limit   Số lượng mỗi trang
     * @param search  Từ khóa tìm kiếm
     * @param comicId ID comic
     * @return Response chứa danh sách chapter của user
     */
    @GetMapping("/chapters")
    public BaseResponse<?> getAllChapters(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String comicId) {
        User currentUser = securityUtils.getCurrentUser();
        return publisherService.getAllChapters(currentUser, page, limit, search, comicId);
    }

    /**
     * Tạo chapter mới
     * POST /publisher/chapters
     * 
     * @param request Dữ liệu chapter
     * @param files   Danh sách ảnh
     * @return Response chứa chapter đã tạo
     */
    @PostMapping("/chapters")
    public BaseResponse<?> createChapter(
            @Valid @RequestPart("data") ChapterRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        User currentUser = securityUtils.getCurrentUser();
        return chapterService.createChapter(request, files, currentUser);
    }

    /**
     * Cập nhật chapter
     * PUT /publisher/chapters/{chapterId}
     * 
     * @param chapterId ID chapter
     * @param request   Dữ liệu chapter
     * @param files     Danh sách ảnh
     * @return Response chứa chapter đã cập nhật
     */
    @PutMapping("/chapters/{chapterId}")
    public BaseResponse<?> updateChapterWithImages(
            @PathVariable String chapterId,
            @Valid @RequestPart("data") ChapterRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        User currentUser = securityUtils.getCurrentUser();
        return chapterService.updateChapter(chapterId, request, files, currentUser);
    }

    /**
     * Xóa chapter
     * DELETE /publisher/chapters/{chapterId}
     * 
     * @param chapterId ID chapter
     * @return Response chứa chapter đã xóa
     */
    @DeleteMapping("/chapters/{chapterId}")
    public BaseResponse<?> deleteChapter(
            @PathVariable String chapterId) {
        User currentUser = securityUtils.getCurrentUser();
        return chapterService.deleteChapter(chapterId, currentUser);
    }
}