package com.thjvjpxx.backend_comic.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.constant.GlobalConstants;
import com.thjvjpxx.backend_comic.dto.request.PublisherChapterRequest;
import com.thjvjpxx.backend_comic.dto.request.PublisherComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherComicResponse;
import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.DetailChapter;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.PurchasedChapterRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
import com.thjvjpxx.backend_comic.service.StorageService;
import com.thjvjpxx.backend_comic.service.PublisherService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.StringUtils;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PublisherServiceImpl implements PublisherService {

    ComicRepository comicRepository;
    ChapterRepository chapterRepository;
    CategoryRepository categoryRepository;
    PurchasedChapterRepository purchasedChapterRepository;
    UserRepository userRepository;
    StorageService b2StorageService;

    @Override
    @Transactional
    public BaseResponse<Comic> createComic(String currentUserId, PublisherComicRequest request,
            MultipartFile coverFile) {
        User publisher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        // Validate categories
        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        if (categories.size() != request.getCategoryIds().size()) {
            throw new BaseException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // Create slug
        String slug = StringUtils.generateSlug(request.getName());

        // Check if slug exists
        if (comicRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        // Handle cover upload
        String thumbUrl = request.getThumbUrl();
        if (coverFile != null && !coverFile.isEmpty()) {
            var response = b2StorageService.uploadFile(
                    coverFile,
                    GlobalConstants.TYPE_THUMBNAIL,
                    slug + "_thumb");
            if (response.getStatus() != 200) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            thumbUrl = response.getMessage();
        }

        Comic comic = new Comic();
        comic.setName(request.getName());
        comic.setSlug(slug);
        comic.setOriginName(request.getOriginName());
        comic.setAuthor(request.getAuthor());
        comic.setDescription(request.getDescription());
        comic.setThumbUrl(thumbUrl);
        comic.setStatus(ComicStatus.ONGOING);
        comic.setPublisher(publisher);
        comic.addCategories(categories);

        Comic savedComic = comicRepository.save(comic);
        return BaseResponse.success(savedComic);
    }

    @Override
    @Transactional
    public BaseResponse<Comic> updateComic(String currentUserId, String comicId, PublisherComicRequest request,
            MultipartFile coverFile) {
        User publisher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        validateComicOwnershipByComicId(publisher, comicId);
        Comic comic = findComicById(comicId);

        // Validate categories
        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        if (categories.size() != request.getCategoryIds().size()) {
            throw new BaseException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // Handle cover upload
        String thumbUrl = comic.getThumbUrl();
        if (coverFile != null && !coverFile.isEmpty()) {
            var response = b2StorageService.uploadFile(
                    coverFile,
                    GlobalConstants.TYPE_THUMBNAIL,
                    comic.getSlug() + "_thumb");
            if (response.getStatus() != 200) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            thumbUrl = response.getMessage();
        } else if (request.getThumbUrl() != null) {
            // Nếu không upload file mới nhưng có URL từ request
            thumbUrl = request.getThumbUrl();
        }

        // Update fields
        comic.setName(request.getName());
        comic.setOriginName(request.getOriginName());
        comic.setAuthor(request.getAuthor());
        comic.setDescription(request.getDescription());
        comic.setThumbUrl(thumbUrl);

        // Update categories
        comic.getCategories().clear();
        comic.addCategories(categories);

        Comic savedComic = comicRepository.save(comic);
        return BaseResponse.success(savedComic);
    }

    @Override
    @Transactional
    public BaseResponse<Void> deleteComic(String currentUserId, String comicId) {
        User publisher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        validateComicOwnershipByComicId(publisher, comicId);
        Comic comic = findComicById(comicId);

        String thumbUrl = comic.getThumbUrl();
        if (thumbUrl != null && !thumbUrl.isEmpty() && thumbUrl.startsWith(B2Constants.URL_PREFIX)) {
            b2StorageService.remove(thumbUrl);
        }

        comicRepository.delete(comic);
        return BaseResponse.success("Xóa truyện thành công");
    }

    @Override
    public BaseResponse<List<PublisherComicResponse>> getMyComics(String currentUserId, String search, String status,
            String category, int page, int size) {
        User publisher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PaginationUtils.createPageable(page, size);
        int originalPage = page;
        Page<Comic> comics = null;

        // Áp dụng logic giống getAllComics nhưng với điều kiện thêm publisher
        if (search != null && !search.isEmpty()) {
            comics = comicRepository.findByPublisherAndSearchTerm(publisher, search, pageable);
        } else if (status != null && !status.isEmpty()) {
            ComicStatus comicStatus = ComicStatus.valueOf(status.toUpperCase());
            comics = comicRepository.findByPublisherAndStatus(publisher, comicStatus, pageable);
        } else if (category != null && !category.isEmpty()) {
            comics = comicRepository.findByPublisherAndCategory(publisher, category, pageable);
        } else {
            comics = comicRepository.findByPublisher(publisher, pageable);
        }

        List<PublisherComicResponse> responses = comics.getContent().stream()
                .map(this::convertToPublisherComicResponse)
                .collect(Collectors.toList());

        return BaseResponse.success(
                responses,
                originalPage,
                (int) comics.getTotalElements(),
                size,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<PublisherComicResponse> getMyComic(User publisher, String comicId) {
        validateComicOwnershipByComicId(publisher, comicId);
        Comic comic = findComicById(comicId);

        PublisherComicResponse response = convertToPublisherComicResponse(comic);
        return BaseResponse.success(response);
    }

    @Override
    @Transactional
    public BaseResponse<Chapter> createChapter(User publisher, String comicId, PublisherChapterRequest request) {
        validateComicOwnershipByComicId(publisher, comicId);
        Comic comic = findComicById(comicId);

        // Check if chapter number exists
        if (chapterRepository.existsByComicAndChapterNumber(comic, request.getChapterNumber())) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
        }

        Chapter chapter = Chapter.builder()
                .title(request.getTitle())
                .chapterNumber(request.getChapterNumber())
                .price(request.getPrice())
                .status(request.getStatus())
                .comic(comic)
                .build();

        Chapter savedChapter = chapterRepository.save(chapter);
        final Chapter finalChapter = savedChapter;

        // Create detail chapters for images
        List<DetailChapter> detailChapters = request.getImageUrls().stream()
                .map(imageUrl -> {
                    DetailChapter detail = new DetailChapter();
                    detail.setImgUrl(imageUrl);
                    detail.setChapter(finalChapter);
                    return detail;
                })
                .collect(Collectors.toList());

        savedChapter.setDetailChapters(detailChapters);

        savedChapter = chapterRepository.save(savedChapter);
        return BaseResponse.success(savedChapter);
    }

    @Override
    @Transactional
    public BaseResponse<Chapter> updateChapter(User publisher, String chapterId, PublisherChapterRequest request) {
        validateComicOwnershipByChapterId(publisher, chapterId);
        Chapter chapter = findChapterById(chapterId);

        // Check if chapter number exists (excluding current chapter)
        if (!chapter.getChapterNumber().equals(request.getChapterNumber()) &&
                chapterRepository.existsByComicAndChapterNumber(chapter.getComic(), request.getChapterNumber())) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
        }

        chapter.setTitle(request.getTitle());
        chapter.setChapterNumber(request.getChapterNumber());
        chapter.setPrice(request.getPrice());
        chapter.setStatus(request.getStatus());

        // Update detail chapters
        chapter.getDetailChapters().clear();
        List<DetailChapter> detailChapters = request.getImageUrls().stream()
                .map(imageUrl -> {
                    DetailChapter detail = new DetailChapter();
                    detail.setImgUrl(imageUrl);
                    detail.setChapter(chapter);
                    return detail;
                })
                .collect(Collectors.toList());
        chapter.setDetailChapters(detailChapters);

        Chapter savedChapter = chapterRepository.save(chapter);
        return BaseResponse.success(savedChapter);
    }

    @Override
    @Transactional
    public BaseResponse<Void> deleteChapter(User publisher, String chapterId) {
        validateComicOwnershipByChapterId(publisher, chapterId);
        Chapter chapter = findChapterById(chapterId);

        chapterRepository.delete(chapter);
        return BaseResponse.success("Xóa chương thành công");
    }

    @Override
    public BaseResponse<List<Chapter>> getChaptersByComic(User publisher, String comicId, int page, int limit) {
        validateComicOwnershipByComicId(publisher, comicId);
        Comic comic = findComicById(comicId);

        Pageable pageable = PaginationUtils.createPageable(page, limit);
        Page<Chapter> chapters = chapterRepository.findByComicOrderByChapterNumberAsc(comic, pageable);

        return BaseResponse.success(
                chapters.getContent(),
                page,
                (int) chapters.getTotalElements(),
                limit,
                chapters.getTotalPages());
    }

    /**
     * Xác thực quyền sở hữu comic bằng comicId
     */
    @Override
    public void validateComicOwnershipByComicId(User publisher, String comicId) {
        Comic comic = findComicById(comicId);

        if (!comic.getPublisher().getId().equals(publisher.getId())) {
            throw new BaseException(ErrorCode.PUBLISHER_COMIC_NOT_OWNER);
        }
    }

    /**
     * Xác thực quyền sở hữu comic bằng chapterId
     */
    @Override
    public void validateComicOwnershipByChapterId(User publisher, String chapterId) {
        Chapter chapter = findChapterById(chapterId);

        if (!chapter.getComic().getPublisher().getId().equals(publisher.getId())) {
            throw new BaseException(ErrorCode.PUBLISHER_COMIC_NOT_OWNER);
        }
    }

    @Override
    @Transactional
    public BaseResponse<Chapter> createChapterWithImages(User publisher, String comicId,
            PublisherChapterRequest request, List<MultipartFile> images) {
        validateComicOwnershipByComicId(publisher, comicId);
        Comic comic = findComicById(comicId);

        // Check if chapter number exists
        if (chapterRepository.existsByComicAndChapterNumber(comic, request.getChapterNumber())) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
        }

        // Upload images to storage
        List<String> imageUrls = uploadChapterImages(images, comic.getSlug(), request.getChapterNumber());

        // Update request with uploaded URLs
        request.setImageUrls(imageUrls);

        return createChapter(publisher, comicId, request);
    }

    @Override
    @Transactional
    public BaseResponse<Chapter> updateChapterWithImages(User publisher, String chapterId,
            PublisherChapterRequest request, List<MultipartFile> images) {
        validateComicOwnershipByChapterId(publisher, chapterId);
        Chapter chapter = findChapterById(chapterId);

        // Upload new images if provided
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = uploadChapterImages(images,
                    chapter.getComic().getSlug(),
                    request.getChapterNumber());
            request.setImageUrls(imageUrls);
        }

        return updateChapter(publisher, chapterId, request);
    }

    @Override
    public BaseResponse<?> getAllChapters(String currentUserId, int page, int limit, String search,
            String comicId) {
        User publisher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PaginationUtils.createPageableWithSort(page, limit, "chapterNumber",
                Sort.Direction.ASC);
        int originalPage = page;
        Page<Chapter> chapters = null;

        if (search != null && !search.isEmpty() && comicId != null && !comicId.isEmpty()) {
            validateComicOwnershipByComicId(publisher, comicId);
            chapters = chapterRepository.findByTitleContainingAndComicId(search, comicId, pageable);
        } else if (search != null && !search.isEmpty()) {
            Page<Comic> publisherComics = comicRepository.findByPublisher(publisher, Pageable.unpaged());
            List<String> comicIds = publisherComics.getContent().stream()
                    .map(Comic::getId)
                    .collect(Collectors.toList());

            if (comicIds.isEmpty()) {
                chapters = Page.empty(pageable);
            } else {
                Page<Chapter> allChapters = chapterRepository.findByTitleContaining(search, pageable);
                List<Chapter> filteredChapters = allChapters.getContent().stream()
                        .filter(chapter -> comicIds.contains(chapter.getComic().getId()))
                        .collect(Collectors.toList());
                chapters = new org.springframework.data.domain.PageImpl<>(filteredChapters, pageable,
                        filteredChapters.size());
            }
        } else if (comicId != null && !comicId.isEmpty()) {
            validateComicOwnershipByComicId(publisher, comicId);
            chapters = chapterRepository.findByComicId(comicId, pageable);
        } else {
            Page<Comic> publisherComics = comicRepository.findByPublisher(publisher, Pageable.unpaged());
            List<String> comicIds = publisherComics.getContent().stream()
                    .map(Comic::getId)
                    .collect(Collectors.toList());

            if (comicIds.isEmpty()) {
                chapters = Page.empty(pageable);
            } else {
                Page<Chapter> allChapters = chapterRepository.findAll(pageable);
                List<Chapter> filteredChapters = allChapters.getContent().stream()
                        .filter(chapter -> comicIds.contains(chapter.getComic().getId()))
                        .collect(Collectors.toList());
                chapters = new org.springframework.data.domain.PageImpl<>(filteredChapters, pageable,
                        filteredChapters.size());
            }
        }

        List<Chapter> chapterList = chapters.getContent();

        if (chapterList.isEmpty()) {
            return BaseResponse.success(
                    new ArrayList<>(),
                    originalPage,
                    0,
                    limit,
                    0);
        }

        return BaseResponse.success(
                chapterList,
                originalPage,
                (int) chapters.getTotalElements(),
                limit,
                chapters.getTotalPages());
    }

    @Override
    @Transactional
    public BaseResponse<Void> deleteMultipleChapters(User publisher, List<String> chapterIds) {
        validateComicOwnershipByChapterId(publisher, chapterIds.get(0));

        List<Chapter> chapters = chapterRepository.findAllById(chapterIds);
        chapterRepository.deleteAll(chapters);

        return BaseResponse.success("Xóa các chương thành công");
    }

    @Override
    @Transactional
    public BaseResponse<Void> reorderChapter(User publisher, String chapterId, Double newChapterNumber) {
        validateComicOwnershipByChapterId(publisher, chapterId);
        Chapter chapter = findChapterById(chapterId);

        // Check if new chapter number exists
        if (chapterRepository.existsByComicAndChapterNumber(chapter.getComic(), newChapterNumber)) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
        }

        chapter.setChapterNumber(newChapterNumber);
        chapterRepository.save(chapter);

        return BaseResponse.success("Sắp xếp lại chương thành công");
    }

    @Override
    public BaseResponse<ChapterStatsResponse> getChapterStats(User publisher, String chapterId) {
        validateComicOwnershipByChapterId(publisher, chapterId);
        Chapter chapter = findChapterById(chapterId);

        // Tính toán thời gian
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        LocalDateTime startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime startOfMonth = now.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);

        // Thống kê lượt mua và doanh thu
        Long totalPurchases = purchasedChapterRepository.countByChapter(chapter);
        Double totalRevenue = purchasedChapterRepository.getTotalRevenueByChapter(chapter);

        Long purchasesToday = purchasedChapterRepository.countPurchasesByChapterBetweenDates(chapter, startOfDay,
                endOfDay);
        Double revenueToday = purchasedChapterRepository.getRevenueByChapterBetweenDates(chapter, startOfDay, endOfDay);

        Long purchasesThisWeek = purchasedChapterRepository.countPurchasesByChapterAfterDate(chapter, startOfWeek);
        Double revenueThisWeek = purchasedChapterRepository.getRevenueByChapterAfterDate(chapter, startOfWeek);

        Long purchasesThisMonth = purchasedChapterRepository.countPurchasesByChapterAfterDate(chapter, startOfMonth);
        Double revenueThisMonth = purchasedChapterRepository.getRevenueByChapterAfterDate(chapter, startOfMonth);

        // Tính toán conversion rate và average revenue per user
        Double conversionRate = 0.0;
        Double averageRevenuePerUser = 0.0;

        if (totalPurchases > 0) {
            averageRevenuePerUser = totalRevenue / totalPurchases;
            // TODO: Cần thêm thống kê views để tính conversion rate chính xác
            // conversionRate = (totalPurchases.doubleValue() / totalViews) * 100;
        }

        ChapterStatsResponse stats = ChapterStatsResponse.builder()
                .chapterId(chapter.getId())
                .chapterTitle(chapter.getTitle())
                .chapterNumber(chapter.getChapterNumber())
                .status(chapter.getStatus().name())
                .price(chapter.getPrice())
                .isFree(chapter.getPrice() == null || chapter.getPrice() == 0.0)
                // Views - TODO: Implement chapter views tracking
                .totalViews(0L)
                .viewsToday(0L)
                .viewsThisWeek(0L)
                .viewsThisMonth(0L)
                // Revenue
                .totalRevenue(totalRevenue != null ? totalRevenue : 0.0)
                .revenueToday(revenueToday != null ? revenueToday : 0.0)
                .revenueThisWeek(revenueThisWeek != null ? revenueThisWeek : 0.0)
                .revenueThisMonth(revenueThisMonth != null ? revenueThisMonth : 0.0)
                // Purchases
                .totalPurchases(totalPurchases)
                .purchasesToday(purchasesToday)
                .purchasesThisWeek(purchasesThisWeek)
                .purchasesThisMonth(purchasesThisMonth)
                // Analytics
                .conversionRate(conversionRate)
                .averageRevenuePerUser(averageRevenuePerUser)
                .build();

        return BaseResponse.success(stats);
    }

    /**
     * Upload danh sách ảnh cho chapter
     */
    private List<String> uploadChapterImages(List<MultipartFile> images, String comicSlug, Double chapterNumber) {
        // TODO: Cần thêm logic upload ảnh cho chapter
        return null;
        // List<String> imageUrls = new ArrayList<>();

        // if (images != null && !images.isEmpty()) {
        // for (int i = 0; i < images.size(); i++) {
        // MultipartFile image = images.get(i);
        // if (!image.isEmpty()) {
        // String fileName = String.format("%s_chapter_%s_page_%d",
        // comicSlug, chapterNumber.toString().replace(".", "_"), i + 1);

        // var response = storageFactory.getStorageService().uploadFile(
        // image,
        // GlobalConstants.TYPE_CHAPTER,
        // fileName);

        // if (response.getStatus() == 200) {
        // imageUrls.add(response.getMessage());
        // } else {
        // throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
        // }
        // }
        // }
        // }

        // return imageUrls;
    }

    // Helper methods
    private Comic findComicById(String comicId) {
        ValidationUtils.checkNullId(comicId);
        return comicRepository.findById(comicId)
                .orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));
    }

    private Chapter findChapterById(String chapterId) {
        ValidationUtils.checkNullId(chapterId);
        return chapterRepository.findById(chapterId)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));
    }

    private PublisherComicResponse convertToPublisherComicResponse(Comic comic) {
        return PublisherComicResponse.builder()
                .id(comic.getId())
                .name(comic.getName())
                .slug(comic.getSlug())
                .originName(comic.getOriginName())
                .thumbUrl(comic.getThumbUrl())
                .author(comic.getAuthor())
                .status(comic.getStatus())
                .description(comic.getDescription())
                .followersCount(comic.getFollowersCount())
                .viewsCount(comic.getViewsCount())
                .categories(comic.getCategories().stream().collect(Collectors.toList()))
                .createdAt(comic.getCreatedAt())
                .updatedAt(comic.getUpdatedAt())
                .build();
    }
}