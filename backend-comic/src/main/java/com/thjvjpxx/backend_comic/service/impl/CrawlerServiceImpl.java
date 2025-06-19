package com.thjvjpxx.backend_comic.service.impl;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenChapterDetail;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenChapterDetail.ChapterImage;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenComicDetail;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenComicDetail.ComicItem;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenComicDetail.OTruyenChapter;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenResponse;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenResponse.OTruyenComic;
import com.thjvjpxx.backend_comic.dto.request.CrawlerComicListRequest;
import com.thjvjpxx.backend_comic.dto.request.CrawlerComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ChapterStatus;
import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.DetailChapter;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.DetailChapterRepository;
import com.thjvjpxx.backend_comic.service.CrawlerService;
import com.thjvjpxx.backend_comic.service.StorageService;
import com.thjvjpxx.backend_comic.utils.NumberUtils;
import com.thjvjpxx.backend_comic.utils.StringUtils;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class CrawlerServiceImpl implements CrawlerService {

    final ComicRepository comicRepository;
    final CategoryRepository categoryRepository;
    final ChapterRepository chapterRepository;
    final DetailChapterRepository detailChapterRepository;
    final StorageService storageService;

    int MIN_CHAPTER_SIZE = 5;
    int MAX_CHAPTER_SIZE = 8;
    boolean CRAWL_FULL = true;

    String OTRUYEN_API_URL = "https://otruyenapi.com/v1/api/danh-sach/truyen-moi?page=";

    String OTRUYEN_API_COMIC_DETAIL = "https://otruyenapi.com/v1/api/truyen-tranh/";

    String OTRUYEN_IMAGE_CDN = "https://img.otruyenapi.com";

    int requestDelayMs = 0;

    int batchDelayMs = 0;

    // Cài đặt đa luồng
    int maxThreads = 10; // Số luồng tối đa cho việc crawl truyện
    int chapterThreads = 5; // Số luồng cho việc crawl chapter
    int imageThreads = 3; // Số luồng cho việc download ảnh

    @Value("${b2.bucketName}")
    String bucketName;

    /**
     * Cấu hình tham số đa luồng dựa trên yêu cầu
     * Có thể gọi method này để tùy chỉnh hiệu suất crawl
     */
    public void configureThreadingParams(int maxComicThreads, int maxChapterThreads, int maxImageThreads,
            int requestDelay, int batchDelayMs) {
        this.maxThreads = Math.max(1, Math.min(maxComicThreads, 20)); // Giới hạn tối đa 20 luồng
        this.chapterThreads = Math.max(1, Math.min(maxChapterThreads, 10));
        this.imageThreads = Math.max(1, Math.min(maxImageThreads, 5));
        this.requestDelayMs = Math.max(0, requestDelay);
        this.batchDelayMs = Math.max(0, batchDelayMs);

        log.info("Đã cấu hình threading: Comic={}, Chapter={}, Image={}, RequestDelay={}ms, BatchDelay={}ms",
                this.maxThreads, this.chapterThreads, this.imageThreads, this.requestDelayMs, this.batchDelayMs);
    }

    @Override
    public BaseResponse<?> crawlComic(CrawlerComicRequest request) {
        // Tạo ExecutorService để xử lý đa luồng
        ExecutorService comicExecutor = Executors.newFixedThreadPool(maxThreads);

        try {
            Map<String, Object> crawlingResult = new HashMap<>();
            Map<String, Object> errorResults = new ConcurrentHashMap<>(); // Thread-safe cho đa luồng
            AtomicInteger totalComicProcessed = new AtomicInteger(0); // Thread-safe counter
            AtomicInteger totalSuccessfulComics = new AtomicInteger(0);

            // Thu thập tất cả comics từ các trang trước
            List<OTruyenComic> allComics = collectAllComicsFromPages(request.getStartPage(), request.getEndPage());

            if (allComics.isEmpty()) {
                log.warn("Không tìm thấy truyện nào trong khoảng trang {} - {}",
                        request.getStartPage(), request.getEndPage());
                return BaseResponse.success(Map.of(
                        "totalProcessed", 0,
                        "totalSuccess", 0,
                        "totalErrors", 0,
                        "errors", new ArrayList<>()));
            }

            log.info("Bắt đầu crawl {} truyện với {} luồng", allComics.size(), maxThreads);

            // Xử lý comics bằng đa luồng
            List<CompletableFuture<Void>> comicFutures = allComics.stream()
                    .map(comicSummary -> CompletableFuture.runAsync(() -> {
                        try {
                            processComicAsync(comicSummary, request.isSaveDrive(),
                                    totalComicProcessed, totalSuccessfulComics, errorResults);
                        } catch (Exception e) {
                            log.error("Lỗi không mong đợi khi xử lý truyện {}: {}",
                                    comicSummary.getSlug(), e.getMessage(), e);
                            errorResults.put(comicSummary.getSlug(),
                                    Map.of("error", "Lỗi không mong đợi: " + e.getMessage()));
                        }
                    }, comicExecutor))
                    .collect(Collectors.toList());

            // Chờ tất cả tasks hoàn thành
            CompletableFuture<Void> allOf = CompletableFuture.allOf(
                    comicFutures.toArray(new CompletableFuture[0]));

            // Timeout sau 30 phút
            allOf.get(30, TimeUnit.MINUTES);

            crawlingResult.put("totalProcessed", totalComicProcessed.get());
            crawlingResult.put("totalSuccess", totalSuccessfulComics.get());
            crawlingResult.put("totalErrors", errorResults.size());
            crawlingResult.put("errors", new ArrayList<>(errorResults.values()));

            log.info("Hoàn thành crawl với {} truyện xử lý, {} thành công, {} lỗi",
                    totalComicProcessed.get(), totalSuccessfulComics.get(), errorResults.size());

            return BaseResponse.success(crawlingResult);
        } catch (Exception e) {
            log.error("Lỗi khi crawl truyện", e);
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        } finally {
            shutdownExecutorService(comicExecutor, "Comic Executor");
        }
    }

    /**
     * Thu thập tất cả comics từ các trang cần crawl
     */
    private List<OTruyenComic> collectAllComicsFromPages(int startPage, int endPage) {
        List<OTruyenComic> allComics = new ArrayList<>();
        RestTemplate restTemplate = new RestTemplate();

        for (int currentPage = startPage; currentPage <= endPage; currentPage++) {
            try {
                log.info("Đang thu thập dữ liệu từ trang {} / {}", currentPage, endPage);

                ResponseEntity<OTruyenResponse> responseEntity = restTemplate.getForEntity(
                        OTRUYEN_API_URL + currentPage, OTruyenResponse.class);

                if (responseEntity.getStatusCode() != HttpStatus.OK ||
                        responseEntity.getBody() == null) {
                    log.error("Không thể lấy dữ liệu từ OTruyen API cho trang {}", currentPage);
                    continue;
                }

                OTruyenResponse response = responseEntity.getBody();
                List<OTruyenComic> comics = response.getData().getItems();

                if (comics != null && !comics.isEmpty()) {
                    allComics.addAll(comics);
                    log.info("Thu thập được {} truyện từ trang {}", comics.size(), currentPage);
                } else {
                    log.warn("Không tìm thấy truyện nào ở trang {}", currentPage);
                }

                // Tạm nghỉ giữa các request để tránh overload server
                if (currentPage < endPage) {
                    Thread.sleep(requestDelayMs);
                }
            } catch (Exception e) {
                log.error("Lỗi khi thu thập dữ liệu từ trang {}: {}", currentPage, e.getMessage());
            }
        }

        log.info("Hoàn thành thu thập dữ liệu: {} truyện từ {} trang", allComics.size(), endPage - startPage + 1);
        return allComics;
    }

    /**
     * Xử lý một comic trong thread riêng biệt
     */
    private void processComicAsync(OTruyenComic comicSummary, boolean isSaveDrive,
            AtomicInteger totalProcessed, AtomicInteger totalSuccess,
            Map<String, Object> errorResults) {
        try {
            String slug = comicSummary.getSlug();
            if (slug == null || slug.isEmpty()) {
                log.warn("Bỏ qua comic với slug rỗng");
                return;
            }

            log.debug("Bắt đầu xử lý truyện: {}", slug);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<OTruyenComicDetail> comicDetailResponse = restTemplate
                    .getForEntity(OTRUYEN_API_COMIC_DETAIL + slug, OTruyenComicDetail.class);

            if (comicDetailResponse.getStatusCode() != HttpStatus.OK
                    || comicDetailResponse.getBody() == null) {
                log.error("Không thể lấy chi tiết cho truyện: {}", slug);
                errorResults.put(slug, Map.of(
                        "comicSlug", slug,
                        "error", "Không thể lấy chi tiết cho truyện"));
                return;
            }

            OTruyenComicDetail comicDetail = comicDetailResponse.getBody();
            boolean success = processComicWithChaptersAsync(comicDetail, isSaveDrive);

            totalProcessed.incrementAndGet();
            if (success) {
                totalSuccess.incrementAndGet();
                log.info("Crawl thành công truyện: {}", slug);
            } else {
                log.warn("Crawl không thành công cho truyện: {}", slug);
            }

        } catch (Exception e) {
            log.error("Lỗi khi xử lý truyện {}: {}", comicSummary.getSlug(), e.getMessage(), e);
            errorResults.put(comicSummary.getSlug(), Map.of(
                    "comicSlug", comicSummary.getSlug(),
                    "error", e.getMessage()));
            totalProcessed.incrementAndGet();
        }
    }

    /**
     * Đóng ExecutorService một cách an toàn
     */
    private void shutdownExecutorService(ExecutorService executor, String executorName) {
        if (executor != null && !executor.isShutdown()) {
            log.info("Đang đóng {}", executorName);
            executor.shutdown();
            try {
                if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                    log.warn("{} không đóng trong 60 giây, force shutdown", executorName);
                    executor.shutdownNow();
                    if (!executor.awaitTermination(30, TimeUnit.SECONDS)) {
                        log.error("{} không thể đóng hoàn toàn", executorName);
                    }
                }
            } catch (InterruptedException e) {
                log.error("Bị gián đoạn khi đóng {}", executorName, e);
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }

    /**
     * Phiên bản async của processComicWithChapters, tối ưu cho đa luồng
     */
    private boolean processComicWithChaptersAsync(OTruyenComicDetail comicDetail, boolean isSaveDrive) {
        // Tạo ExecutorService riêng cho chapters của comic này
        ExecutorService chapterExecutor = Executors.newFixedThreadPool(chapterThreads);

        try {
            ComicItem oTruyenComic = comicDetail.getData().getItem();

            String slug = StringUtils.generateSlug(oTruyenComic.getName());
            Optional<Comic> existingComicOptional = comicRepository.findBySlug(slug);

            Comic comic;
            boolean isExistingComic = existingComicOptional.isPresent();

            if (isExistingComic) {
                comic = existingComicOptional.get();
                log.debug("Truyện đã tồn tại: {}, ID: {}", comic.getName(), comic.getId());
            } else {
                comic = createNewComic(oTruyenComic, slug, isSaveDrive);
                log.info("Đã thêm truyện mới: {}, ID: {}", comic.getName(), comic.getId());
            }

            return processChaptersAsync(comicDetail, comic, isExistingComic, isSaveDrive, chapterExecutor);

        } catch (Exception e) {
            log.error("Lỗi khi xử lý truyện: {}", e.getMessage(), e);
            return false;
        } finally {
            shutdownExecutorService(chapterExecutor, "Chapter Executor");
        }
    }

    /**
     * Tạo comic mới (extracted từ processComicWithChapters để tái sử dụng)
     */
    @Transactional
    private Comic createNewComic(ComicItem oTruyenComic, String slug, boolean isSaveDrive) {
        Comic comic = new Comic();

        comic.setName(oTruyenComic.getName());
        comic.setSlug(slug);
        comic.setOriginName(String.join(", ", oTruyenComic.getOrigin_name()));
        comic.setAuthor(String.join(", ", oTruyenComic.getAuthor()));

        if ("ongoing".equals(oTruyenComic.getStatus())) {
            comic.setStatus(ComicStatus.ONGOING);
        } else if ("completed".equals(oTruyenComic.getStatus())) {
            comic.setStatus(ComicStatus.COMPLETED);
        } else {
            comic.setStatus(ComicStatus.COMING_SOON);
        }

        // Xử lý thumbnail
        if (oTruyenComic.getThumb_url() != null && !oTruyenComic.getThumb_url().isEmpty()) {
            String thumbnailUrl = OTRUYEN_IMAGE_CDN + "/uploads/comics/" + oTruyenComic.getThumb_url();

            if (isSaveDrive) {
                try {
                    String savedThumbnailUrl = downloadAndSaveThumbnail(thumbnailUrl, slug);
                    comic.setThumbUrl(savedThumbnailUrl);
                } catch (Exception e) {
                    log.error("Lỗi khi lưu thumbnail cho truyện {}: {}", comic.getName(), e.getMessage());
                    comic.setThumbUrl(thumbnailUrl);
                }
            } else {
                comic.setThumbUrl(thumbnailUrl);
            }
        }

        // Xử lý categories
        if (oTruyenComic.getCategory() != null && !oTruyenComic.getCategory().isEmpty()) {
            List<Category> categories = new ArrayList<>();

            for (var oTruyenCategory : oTruyenComic.getCategory()) {
                String categorySlug = StringUtils.generateSlug(oTruyenCategory.getName());
                Category category;

                Optional<Category> existingCategory = categoryRepository.findBySlug(categorySlug);
                if (existingCategory.isPresent()) {
                    category = existingCategory.get();
                } else {
                    category = new Category();
                    category.setName(oTruyenCategory.getName());
                    category.setSlug(categorySlug);
                    category = categoryRepository.save(category);
                }

                categories.add(category);
            }

            comic = comicRepository.save(comic);
            comic.setCategories(categories);
            comic = comicRepository.save(comic);
        }

        comic.setDescription(oTruyenComic.getContent() != null ? oTruyenComic.getContent() : "Đang cập nhật");
        return comicRepository.save(comic);
    }

    /**
     * Xử lý chapters với đa luồng
     */
    private boolean processChaptersAsync(OTruyenComicDetail comicDetail, Comic comic, boolean isExistingComic,
            boolean isSaveDrive, ExecutorService chapterExecutor) {
        try {
            List<OTruyenChapter> chapters = new ArrayList<>();

            ComicItem item = comicDetail.getData().getItem();
            if (item.getChapters() == null || item.getChapters().isEmpty()) {
                log.warn("Không có chapter nào cho truyện: {}", comic.getName());
                return false;
            }

            var firstChapter = item.getChapters().get(0);
            if (firstChapter == null || firstChapter.getServer_data() == null) {
                log.warn("Không có server_data cho truyện: {}", comic.getName());
                return false;
            }

            chapters = firstChapter.getServer_data();

            if (!CRAWL_FULL && chapters.size() >= 10) {
                Random random = new Random();
                int randomChapterSize = random.nextInt(MAX_CHAPTER_SIZE - MIN_CHAPTER_SIZE + 1) + MIN_CHAPTER_SIZE;
                chapters = chapters.subList(0, randomChapterSize);
            }

            Double latestChapterNumber = null;
            if (isExistingComic) {
                latestChapterNumber = chapterRepository.findMaxChapterNumberByComicId(comic.getId());
                log.debug("Chapter mới nhất của truyện {}: {}", comic.getName(),
                        latestChapterNumber != null ? latestChapterNumber : "Chưa có chapter");
            }

            AtomicInteger successfulChapters = new AtomicInteger(0);

            // Xử lý chapters bằng đa luồng
            List<CompletableFuture<Boolean>> chapterFutures = new ArrayList<>();

            for (OTruyenChapter chapter : chapters) {
                Double finalLatestChapterNumber = latestChapterNumber;

                CompletableFuture<Boolean> chapterFuture = CompletableFuture.supplyAsync(() -> {
                    try {
                        Thread.sleep(requestDelayMs); // Rate limiting

                        double chapterNumber;
                        try {
                            chapterNumber = NumberUtils.parseStringToDouble(chapter.getChapter_name());

                            if (isExistingComic && finalLatestChapterNumber != null
                                    && chapterNumber <= finalLatestChapterNumber) {
                                log.debug("Bỏ qua chapter {} vì đã tồn tại", chapterNumber);
                                return false;
                            }
                        } catch (NumberFormatException e) {
                            log.error("Không thể phân tích chapter number: " + chapter.getChapter_name(), e);
                            return false;
                        }

                        return processChapterAsync(chapter, comic, finalLatestChapterNumber, isExistingComic,
                                isSaveDrive);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        log.error("Thread bị gián đoạn khi xử lý chapter: {}", chapter.getChapter_name());
                        return false;
                    } catch (Exception e) {
                        log.error("Lỗi khi xử lý chapter {}: {}", chapter.getChapter_name(), e.getMessage());
                        return false;
                    }
                }, chapterExecutor);

                chapterFutures.add(chapterFuture);
            }

            // Chờ tất cả chapters hoàn thành và đếm số thành công
            for (CompletableFuture<Boolean> future : chapterFutures) {
                try {
                    if (future.get(5, TimeUnit.MINUTES)) { // Timeout 5 phút cho mỗi chapter
                        successfulChapters.incrementAndGet();
                    }
                } catch (Exception e) {
                    log.error("Lỗi khi chờ chapter hoàn thành cho truyện {}: {}", comic.getName(), e.getMessage());
                }
            }

            boolean hasSuccess = successfulChapters.get() > 0;
            log.info("Hoàn thành xử lý {} chapters cho truyện {}, {} thành công",
                    chapters.size(), comic.getName(), successfulChapters.get());

            return hasSuccess || !isExistingComic;
        } catch (Exception e) {
            log.error("Lỗi khi xử lý chapters cho truyện {}: {}", comic.getName(), e.getMessage(), e);
            return false;
        }
    }

    /**
     * Xử lý một chapter với khả năng chạy async
     */
    private boolean processChapterAsync(OTruyenChapter chapter, Comic comic, Double latestChapterNumber,
            boolean isExistingComic, boolean isSaveDrive) {
        double chapterNumber;
        try {
            chapterNumber = NumberUtils.parseStringToDouble(chapter.getChapter_name());

            if (shouldSkipChapter(comic.getId(), chapterNumber, latestChapterNumber, isExistingComic)) {
                return false;
            }
        } catch (NumberFormatException e) {
            log.error("Không thể phân tích chapter number: " + chapter.getChapter_name(), e);
            return false;
        }

        RestTemplate restTemplate = new RestTemplate();
        OTruyenChapterDetail chapterDetail = fetchChapterDetail(chapter.getChapter_api_data(), restTemplate);
        if (chapterDetail == null) {
            return false;
        }

        try {
            return saveChapterWithDetails(chapter, chapterNumber, comic, chapterDetail, isSaveDrive);
        } catch (Exception e) {
            log.error("Lỗi khi lưu chapter {} của truyện {}: {}",
                    chapterNumber, comic.getName(), e.getMessage());
            return false;
        }
    }

    @Override
    public BaseResponse<?> crawlComicFromList(CrawlerComicListRequest request) {
        ExecutorService comicExecutor = Executors.newFixedThreadPool(maxThreads);

        try {
            Map<String, Object> crawlingResult = new HashMap<>();
            Map<String, Object> errorResults = new ConcurrentHashMap<>();
            AtomicInteger totalComicProcessed = new AtomicInteger(0);
            AtomicInteger totalSuccessfulComics = new AtomicInteger(0);

            List<OTruyenComic> comics = request.getComics();
            log.info("Bắt đầu crawl {} truyện từ danh sách với {} luồng", comics.size(), maxThreads);

            // Xử lý comics bằng đa luồng
            List<CompletableFuture<Void>> comicFutures = comics.stream()
                    .map(comicSummary -> CompletableFuture.runAsync(() -> {
                        processComicAsync(comicSummary, request.isSaveDrive(),
                                totalComicProcessed, totalSuccessfulComics, errorResults);
                    }, comicExecutor))
                    .collect(Collectors.toList());

            // Chờ tất cả tasks hoàn thành
            CompletableFuture<Void> allOf = CompletableFuture.allOf(
                    comicFutures.toArray(new CompletableFuture[0]));

            // Timeout sau 45 phút
            allOf.get(45, TimeUnit.MINUTES);

            crawlingResult.put("totalProcessed", totalComicProcessed.get());
            crawlingResult.put("totalSuccess", totalSuccessfulComics.get());
            crawlingResult.put("totalErrors", errorResults.size());
            crawlingResult.put("errors", new ArrayList<>(errorResults.values()));

            log.info("Hoàn thành crawl danh sách truyện. Tổng: {}, Thành công: {}, Lỗi: {}",
                    totalComicProcessed.get(), totalSuccessfulComics.get(), errorResults.size());

            return BaseResponse.success(crawlingResult);
        } catch (Exception e) {
            log.error("Lỗi khi crawl danh sách truyện", e);
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        } finally {
            shutdownExecutorService(comicExecutor, "Comic List Executor");
        }
    }

    @Transactional
    private boolean saveChapterWithDetails(OTruyenChapter chapter, double chapterNumber, Comic comic,
            OTruyenChapterDetail chapterDetail, boolean isSaveDrive) {
        try {
            log.info("Bắt đầu transaction lưu chapter {} cho truyện: {}", chapterNumber, comic.getName());

            // Lưu chapter trước
            Chapter chapterNew = saveNewChapter(chapter, chapterNumber, comic, chapterDetail, isSaveDrive);

            List<ChapterImage> chapterImages = chapterDetail.getData().getItem().getChapter_image();

            if (chapterImages == null || chapterImages.isEmpty()) {
                log.warn("Không có ảnh nào cho chapter {} của truyện: {}", chapterNumber, comic.getName());
                return false;
            }

            // Lấy thông tin gốc từ OTruyen để xây dựng URL ảnh
            String originalDomainCdn = chapterDetail.getData().getDomain_cdn();
            String originalChapterPath = chapterDetail.getData().getItem().getChapter_path();

            // Lưu tất cả detail chapter
            processChapterDetail(chapterImages, chapterNew, isSaveDrive, originalDomainCdn, originalChapterPath);

            log.info("Đã commit transaction - lưu thành công chapter {} với {} ảnh cho truyện: {}",
                    chapterNumber, chapterImages.size(), comic.getName());
            return true;
        } catch (Exception e) {
            log.error("Lỗi trong transaction khi lưu chapter {} cho truyện {}: {}",
                    chapterNumber, comic.getName(), e.getMessage(), e);
            // Transaction sẽ tự động rollback khi có exception
            throw new RuntimeException("Lỗi khi lưu chapter: " + e.getMessage(), e);
        }
    }

    private boolean shouldSkipChapter(String comicId, double chapterNumber,
            Double latestChapterNumber, boolean isExistingComic) {
        if (isExistingComic && latestChapterNumber != null && chapterNumber <= latestChapterNumber) {
            log.debug("Bỏ qua chapter {} vì nhỏ hơn chương mới nhất", chapterNumber);
            return true;
        }

        Optional<Chapter> existingChapter = chapterRepository.findByComicIdAndChapterNumber(comicId, chapterNumber);
        if (existingChapter.isPresent()) {
            log.debug("Bỏ qua chapter {} vì đã tồn tại", chapterNumber);
            return true;
        }

        return false;
    }

    private OTruyenChapterDetail fetchChapterDetail(String chapterApiData, RestTemplate restTemplate) {
        try {
            ResponseEntity<OTruyenChapterDetail> chapterDetailResponse = restTemplate
                    .getForEntity(chapterApiData, OTruyenChapterDetail.class);

            if (chapterDetailResponse.getStatusCode() != HttpStatus.OK || chapterDetailResponse.getBody() == null) {
                log.error("Không thể lấy chi tiết cho chapter: {}", chapterApiData);
                return null;
            }

            return chapterDetailResponse.getBody();
        } catch (Exception e) {
            log.error("Lỗi khi lấy chi tiết chapter: {}", chapterApiData, e);
            return null;
        }
    }

    private Chapter saveNewChapter(OTruyenChapter chapter, double chapterNumber, Comic comic,
            OTruyenChapterDetail chapterDetail, boolean isSaveDrive) {
        String domainCdn = null;
        String chapterPath = null;

        if (isSaveDrive) {
            chapterPath = String.format("%s/chapter-%s", comic.getSlug(), chapterNumber);
            domainCdn = B2Constants.URL_PREFIX + bucketName + "/" + B2Constants.FOLDER_KEY_COMIC;
        } else {
            domainCdn = chapterDetail.getData().getDomain_cdn();
            chapterPath = chapterDetail.getData().getItem().getChapter_path();
        }

        Chapter chapterNew = Chapter.builder()
                .chapterNumber(chapterNumber)
                .title(chapter.getFilename())
                .status(ChapterStatus.FREE)
                .comic(comic)
                .domainCdn(domainCdn)
                .chapterPath(chapterPath)
                .build();

        // Lưu chapter trong transaction
        chapterNew = chapterRepository.save(chapterNew);
        log.info("Đã tạo chapter entity: {} cho truyện: {}", chapterNumber, comic.getName());

        return chapterNew;
    }

    private void processChapterDetail(List<ChapterImage> chapterImages, Chapter chapterNew, boolean isSaveDrive,
            String originalDomainCdn, String originalChapterPath) {

        if (isSaveDrive && chapterImages.size() > 3) {
            // Sử dụng đa luồng cho việc download ảnh nếu có nhiều ảnh và cần lưu drive
            processChapterDetailAsync(chapterImages, chapterNew, originalDomainCdn, originalChapterPath);
        } else {
            // Xử lý tuần tự cho trường hợp ít ảnh hoặc không lưu drive
            processChapterDetailSync(chapterImages, chapterNew, isSaveDrive, originalDomainCdn, originalChapterPath);
        }
    }

    /**
     * Xử lý detail chapter với đa luồng (cho việc download ảnh)
     */
    private void processChapterDetailAsync(List<ChapterImage> chapterImages, Chapter chapterNew,
            String originalDomainCdn, String originalChapterPath) {
        ExecutorService imageExecutor = Executors.newFixedThreadPool(imageThreads);

        try {
            List<CompletableFuture<DetailChapter>> imageFutures = new ArrayList<>();

            for (int i = 0; i < chapterImages.size(); i++) {
                ChapterImage chapterImageItem = chapterImages.get(i);
                int finalI = i;

                CompletableFuture<DetailChapter> imageFuture = CompletableFuture.supplyAsync(() -> {
                    try {
                        // Xây dựng URL gốc từ OTruyen
                        String originalImageUrl = originalDomainCdn + "/" + originalChapterPath + "/"
                                + chapterImageItem.getImage_file();

                        String imgUrl = downloadAndSaveChapterImage(originalImageUrl, chapterNew.getComic().getSlug(),
                                chapterNew.getChapterNumber(), finalI);

                        return DetailChapter.builder()
                                .orderNumber(chapterImageItem.getImage_page())
                                .imgUrl(imgUrl)
                                .chapter(chapterNew)
                                .build();
                    } catch (Exception e) {
                        log.error("Lỗi khi lưu ảnh chapter {}, page {}: {}",
                                chapterNew.getChapterNumber(), finalI + 1, e.getMessage());
                        // Fallback về filename gốc nếu không thể upload
                        return DetailChapter.builder()
                                .orderNumber(chapterImageItem.getImage_page())
                                .imgUrl(chapterImageItem.getImage_file())
                                .chapter(chapterNew)
                                .build();
                    }
                }, imageExecutor);

                imageFutures.add(imageFuture);
            }

            // Chờ tất cả ảnh được xử lý và thu thập kết quả
            List<DetailChapter> detailChapters = new ArrayList<>();
            for (CompletableFuture<DetailChapter> future : imageFutures) {
                try {
                    DetailChapter detailChapter = future.get(3, TimeUnit.MINUTES); // Timeout 3 phút cho mỗi ảnh
                    detailChapters.add(detailChapter);
                } catch (Exception e) {
                    log.error("Lỗi khi chờ download ảnh hoàn thành cho chapter {}: {}",
                            chapterNew.getChapterNumber(), e.getMessage());
                }
            }

            // Lưu tất cả detail chapter trong transaction
            detailChapterRepository.saveAll(detailChapters);

            log.info("Đã lưu {} detail chapter (async) cho chapter {} của truyện: {}",
                    detailChapters.size(),
                    chapterNew.getChapterNumber(),
                    chapterNew.getComic().getName());

        } finally {
            shutdownExecutorService(imageExecutor, "Image Executor");
        }
    }

    /**
     * Xử lý detail chapter tuần tự (phương thức gốc)
     */
    private void processChapterDetailSync(List<ChapterImage> chapterImages, Chapter chapterNew, boolean isSaveDrive,
            String originalDomainCdn, String originalChapterPath) {
        List<DetailChapter> detailChapters = new ArrayList<>();

        for (int i = 0; i < chapterImages.size(); i++) {
            ChapterImage chapterImageItem = chapterImages.get(i);
            String imgUrl;

            if (isSaveDrive) {
                try {
                    // Xây dựng URL gốc từ OTruyen
                    String originalImageUrl = originalDomainCdn + "/" + originalChapterPath + "/"
                            + chapterImageItem.getImage_file();

                    imgUrl = downloadAndSaveChapterImage(originalImageUrl, chapterNew.getComic().getSlug(),
                            chapterNew.getChapterNumber(), i);
                } catch (Exception e) {
                    log.error("Lỗi khi lưu ảnh chapter {}, page {}: {}",
                            chapterNew.getChapterNumber(), i + 1, e.getMessage());
                    // Fallback về filename gốc nếu không thể upload
                    imgUrl = chapterImageItem.getImage_file();
                }
            } else {
                imgUrl = chapterImageItem.getImage_file();
            }

            DetailChapter detailChapter = DetailChapter.builder()
                    .orderNumber(chapterImageItem.getImage_page())
                    .imgUrl(imgUrl)
                    .chapter(chapterNew)
                    .build();

            detailChapters.add(detailChapter);
        }

        // Lưu tất cả detail chapter trong transaction
        detailChapterRepository.saveAll(detailChapters);

        log.info("Đã lưu {} detail chapter (sync) cho chapter {} của truyện: {}",
                detailChapters.size(),
                chapterNew.getChapterNumber(),
                chapterNew.getComic().getName());
    }

    private String downloadAndSaveThumbnail(String imageUrl, String comicSlug) throws IOException {
        try (InputStream inputStream = URI.create(imageUrl).toURL().openStream()) {
            String extension = getExtensionFromUrl(imageUrl);
            if (extension == null) {
                extension = "jpg";
            }

            String fileName = comicSlug + "_thumb." + extension;

            byte[] imageBytes = inputStream.readAllBytes();
            MultipartFile multipartFile = new CustomMultipartFile(
                    "thumbnail",
                    fileName,
                    "image/" + extension,
                    imageBytes);

            var response = storageService.uploadFile(multipartFile, B2Constants.FOLDER_KEY_THUMBNAIL, fileName);

            if (response.getStatus() == 200) {
                return (String) response.getMessage();
            } else {
                throw new IOException("Upload failed with status: " + response.getStatus());
            }
        }
    }

    private String downloadAndSaveChapterImage(String imageUrl, String comicSlug, Double chapterNumber, int pageIndex)
            throws IOException {
        try (InputStream inputStream = URI.create(imageUrl).toURL().openStream()) {
            String extension = getExtensionFromUrl(imageUrl);
            if (extension == null) {
                extension = "jpg";
            }

            // Tạo filename đơn giản giống ChapterServiceImpl
            String fileName = String.format("page_%d.%s", pageIndex + 1, extension);

            // Tạo path giống ChapterServiceImpl: slugComic/chapter-number/fileName
            String slugChapter = String.format("%s/chapter-%s", comicSlug, chapterNumber);
            String pathName = slugChapter + "/" + fileName;

            byte[] imageBytes = inputStream.readAllBytes();
            MultipartFile multipartFile = new CustomMultipartFile(
                    "chapterImage",
                    fileName,
                    "image/" + extension,
                    imageBytes);

            var response = storageService.uploadFile(multipartFile, B2Constants.FOLDER_KEY_COMIC, pathName);

            if (response.getStatus() == 200) {
                return fileName;
            } else {
                throw new IOException("Upload failed with status: " + response.getStatus());
            }
        }
    }

    private String getExtensionFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            return null;
        }

        int queryIndex = url.indexOf('?');
        if (queryIndex != -1) {
            url = url.substring(0, queryIndex);
        }

        int lastDotIndex = url.lastIndexOf('.');
        if (lastDotIndex != -1 && lastDotIndex < url.length() - 1) {
            return url.substring(lastDotIndex + 1).toLowerCase();
        }

        return null;
    }

    /**
     * Custom implementation của MultipartFile để tạo từ byte array
     */
    private static class CustomMultipartFile implements MultipartFile {
        private final String name;
        private final String originalFilename;
        private final String contentType;
        private final byte[] content;

        public CustomMultipartFile(String name, String originalFilename, String contentType, byte[] content) {
            this.name = name;
            this.originalFilename = originalFilename;
            this.contentType = contentType;
            this.content = content;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getOriginalFilename() {
            return originalFilename;
        }

        @Override
        public String getContentType() {
            return contentType;
        }

        @Override
        public boolean isEmpty() {
            return content == null || content.length == 0;
        }

        @Override
        public long getSize() {
            return content != null ? content.length : 0;
        }

        @Override
        public byte[] getBytes() throws IOException {
            return content;
        }

        @Override
        public InputStream getInputStream() throws IOException {
            return new ByteArrayInputStream(content);
        }

        @Override
        public void transferTo(java.io.File dest) throws IOException, IllegalStateException {
            throw new UnsupportedOperationException("transferTo not supported");
        }
    }
}