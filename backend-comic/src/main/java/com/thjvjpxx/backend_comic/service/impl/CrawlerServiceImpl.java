package com.thjvjpxx.backend_comic.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenChapterDetail;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenChapterDetail.ChapterImage;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenComicDetail;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenComicDetail.ComicItem;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenComicDetail.OTruyenChapter;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenResponse;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenResponse.OTruyenComic;
import com.thjvjpxx.backend_comic.dto.request.CrawlerComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.websocket.CrawlerProgressMessage;
import com.thjvjpxx.backend_comic.enums.ChapterStatus;
import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.enums.CrawlerStatus;
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
import com.thjvjpxx.backend_comic.task.CrawlerTask;
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
    // final GoogleDriveService googleDriveService;
    final DetailChapterRepository detailChapterRepository;
    final SimpMessagingTemplate messagingTemplate;
    final TaskExecutor taskExecutor;
    final Map<String, CrawlerTask> activeTasks = new ConcurrentHashMap<>();

    @Value("${crawler.otruyen.api-url}")
    String OTRUYEN_API_URL;

    @Value("${crawler.otruyen.api-comic-detail}")
    String OTRUYEN_API_COMIC_DETAIL;

    @Value("${crawler.otruyen.image-cdn}")
    String OTRUYEN_IMAGE_CDN;

    @Value("${crawler.request.delay-ms:1000}")
    int requestDelayMs;

    @Value("${crawler.batch.size:5}")
    int batchSize;

    @Value("${crawler.batch.delay-ms:5000}")
    int batchDelayMs;

    @Transactional
    public BaseResponse<?> crawlComic(CrawlerComicRequest request, CrawlerProgressMessage progressMessage) {
        try {
            Map<String, Object> crawlingResult = new HashMap<>();
            List<Map<String, Object>> errorResults = new ArrayList<>();
            int totalComicProcessed = 0;
            int totalSuccessfulComics = 0;

            RestTemplate restTemplate = new RestTemplate();
            int comicProcessed = 0;

            for (int currentPage = request.getStartPage(); currentPage <= request.getEndPage(); currentPage++) {
                // Kiểm tra nếu task đã bị dừng
                if (progressMessage != null && shouldStopCrawling(progressMessage.getSessionId())) {
                    log.info("Tiến trình crawl đã bị dừng cho session: {}", progressMessage.getSessionId());
                    return BaseResponse.success("Tiến trình crawl đã bị dừng");
                }

                log.info("Đang crawl trang {} / {}", currentPage, request.getEndPage());

                // Cập nhật tiến độ nếu có progressMessage
                if (progressMessage != null) {
                    progressMessage.setCurrentPage(currentPage);
                    progressMessage.setStatus(CrawlerStatus.IN_PROGRESS);
                    sendProgressUpdate(progressMessage);
                }

                if (currentPage > request.getStartPage()) {
                    Thread.sleep(batchDelayMs);
                }

                ResponseEntity<OTruyenResponse> responseEntity = restTemplate.getForEntity(
                        OTRUYEN_API_URL + currentPage, OTruyenResponse.class);

                if (responseEntity.getStatusCode() != HttpStatus.OK ||
                        responseEntity.getBody() == null) {
                    log.error("Không thể lấy dữ liệu từ OTruyen API cho trang {}", currentPage);
                    continue;
                }

                OTruyenResponse response = responseEntity.getBody();
                List<OTruyenComic> comics = response.getData().getItems();

                if (comics == null || comics.isEmpty()) {
                    log.warn("Không tìm thấy truyện nào ở trang {}", currentPage);
                    continue;
                }

                for (OTruyenComic comicSummary : comics) {
                    // Kiểm tra lại nếu task đã bị dừng
                    if (progressMessage != null && shouldStopCrawling(progressMessage.getSessionId())) {
                        log.info("Tiến trình crawl đã bị dừng cho session: {}", progressMessage.getSessionId());
                        return BaseResponse.success("Tiến trình crawl đã bị dừng");
                    }

                    try {
                        Thread.sleep(requestDelayMs);

                        // Cập nhật truyện hiện tại nếu có progressMessage
                        if (progressMessage != null) {
                            progressMessage.setCurrentComic(comicSummary.getSlug());
                            progressMessage.setCurrentComicChaptersProcessed(0);
                            sendProgressUpdate(progressMessage);
                        }

                        String slug = comicSummary.getSlug();
                        if (slug == null || slug.isEmpty()) {
                            continue;
                        }

                        ResponseEntity<OTruyenComicDetail> comicDetailResponse = restTemplate
                                .getForEntity(OTRUYEN_API_COMIC_DETAIL + slug, OTruyenComicDetail.class);

                        if (comicDetailResponse.getStatusCode() != HttpStatus.OK
                                || comicDetailResponse.getBody() == null) {
                            log.error("Không thể lấy chi tiết cho truyện: {}", slug);
                            Map<String, Object> errorResult = new HashMap<>();
                            errorResult.put("comicSlug", slug);
                            errorResult.put("error", "Không thể lấy chi tiết cho truyện");
                            errorResults.add(errorResult);

                            // Thêm lỗi vào progressMessage nếu có
                            if (progressMessage != null) {
                                progressMessage.addError(slug, "Không thể lấy chi tiết cho truyện");
                                sendProgressUpdate(progressMessage);
                            }
                            continue;
                        }

                        OTruyenComicDetail comicDetail = comicDetailResponse.getBody();
                        boolean success = processComicWithChapters(comicDetail,
                                request.isSaveDrive(), restTemplate, progressMessage);

                        if (success) {
                            totalSuccessfulComics++;
                        }

                        comicProcessed++;
                        totalComicProcessed++;

                        // Cập nhật số lượng truyện đã xử lý nếu có progressMessage
                        if (progressMessage != null) {
                            progressMessage.setTotalComicsProcessed(totalComicProcessed);
                            progressMessage.setTotalSuccessfulComics(totalSuccessfulComics);
                            sendProgressUpdate(progressMessage);
                        }

                        if (comicProcessed % batchSize == 0) {
                            log.info("Đã xử lý {} truyện, đang tạm nghỉ...", comicProcessed);
                            Thread.sleep(batchDelayMs);
                        }
                    } catch (Exception e) {
                        log.error("Lỗi khi xử lý truyện với slug: " + comicSummary.getSlug(), e);
                        Map<String, Object> errorResult = new HashMap<>();
                        errorResult.put("comicSlug", comicSummary.getSlug());
                        errorResult.put("error", e.getMessage());
                        errorResults.add(errorResult);

                        // Thêm lỗi vào progressMessage nếu có
                        if (progressMessage != null) {
                            progressMessage.addError(comicSummary.getSlug(), e.getMessage());
                            sendProgressUpdate(progressMessage);
                        }
                    }
                }

                log.info("Hoàn thành crawl trang {} với {} truyện", currentPage,
                        comics.size());
            }

            crawlingResult.put("totalProcessed", totalComicProcessed);
            crawlingResult.put("totalSuccess", totalSuccessfulComics);
            crawlingResult.put("totalErrors", errorResults.size());
            crawlingResult.put("errors", errorResults);

            return BaseResponse.success(crawlingResult);
        } catch (InterruptedException e) {
            log.error("Quá trình crawl bị gián đoạn", e);
            Thread.currentThread().interrupt();
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Lỗi khi crawl truyện", e);
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public BaseResponse<?> startCrawlComic(CrawlerComicRequest request, String sessionId) {
        CrawlerTask crawlerTask = new CrawlerTask(messagingTemplate, this) {
            @Override
            public void initialize(CrawlerComicRequest request, String sessionId) {
                super.initialize(request, sessionId);
            }

            @Override
            public void run() {
                try {
                    CrawlerProgressMessage progressMessage = CrawlerProgressMessage.builder()
                            .sessionId(sessionId)
                            .status(CrawlerStatus.STARTED)
                            .totalComicsProcessed(0)
                            .totalSuccessfulComics(0)
                            .currentPage(request.getStartPage())
                            .totalPages(request.getEndPage() - request.getStartPage() + 1)
                            .errors(new ArrayList<>())
                            .build();

                    sendProgressUpdate(progressMessage);
                    progressMessage.setStatus(CrawlerStatus.IN_PROGRESS);
                    sendProgressUpdate(progressMessage);

                    // Sử dụng crawlComicAsync với progressMessage
                    crawlComicAsync(request, progressMessage);

                    progressMessage.setStatus(CrawlerStatus.COMPLETED);
                    sendProgressUpdate(progressMessage);

                    activeTasks.remove(sessionId);
                } catch (Exception e) {
                    log.error("Lỗi trong quá trình crawl: {}", e.getMessage());
                    CrawlerProgressMessage errorMessage = CrawlerProgressMessage.builder()
                            .sessionId(sessionId)
                            .status(CrawlerStatus.ERROR)
                            .build();
                    errorMessage.addError("crawler", e.getMessage());
                    sendProgressUpdate(errorMessage);

                    activeTasks.remove(sessionId);
                }
            }
        };

        // Thêm dòng này để khởi tạo task với request và sessionId
        crawlerTask.initialize(request, sessionId);

        activeTasks.put(sessionId, crawlerTask);
        taskExecutor.execute(crawlerTask);

        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", sessionId);
        response.put("message", "Tiến trình crawl đã bắt đầu");

        return BaseResponse.success(response);
    }

    @Override
    public BaseResponse<?> getCrawlStatus(String sessionId) {
        if (!activeTasks.containsKey(sessionId)) {
            throw new BaseException(ErrorCode.CRAWLER_NOT_FOUND);
        }

        return BaseResponse.success("Tiến trình crawl đang hoạt động");
    }

    @Override
    public BaseResponse<?> stopCrawlTask(String sessionId) {
        if (!activeTasks.containsKey(sessionId)) {
            throw new BaseException(ErrorCode.CRAWLER_NOT_FOUND);
        }

        // Gọi phương thức stop() trên CrawlerTask
        CrawlerTask task = activeTasks.get(sessionId);
        task.stop();

        // Vẫn giữ dòng xóa task khỏi map
        activeTasks.remove(sessionId);

        CrawlerProgressMessage message = CrawlerProgressMessage.builder()
                .sessionId(sessionId)
                .status(CrawlerStatus.COMPLETED)
                .build();
        messagingTemplate.convertAndSend("/topic/crawler/" + sessionId, message);

        return BaseResponse.success("Đã dừng tiến trình crawl");
    }

    private void sendProgressUpdate(CrawlerProgressMessage message) {
        messagingTemplate.convertAndSend("/topic/crawler/" + message.getSessionId(), message);
    }

    @Transactional
    public BaseResponse<?> crawlComic(CrawlerComicRequest request) {
        return crawlComic(request, null);
    }

    @Transactional
    private boolean processComicWithChapters(OTruyenComicDetail comicDetail, boolean isSaveDrive,
            RestTemplate restTemplate, CrawlerProgressMessage progressMessage) throws InterruptedException {
        try {
            ComicItem oTruyenComic = comicDetail.getData().getItem();

            String slug = StringUtils.generateSlug(oTruyenComic.getName());
            Optional<Comic> existingComicOptional = comicRepository.findBySlug(slug);

            Comic comic;
            boolean isExistingComic = existingComicOptional.isPresent();

            if (isExistingComic) {
                comic = existingComicOptional.get();
                log.info("Truyện đã tồn tại: {}, ID: {}", comic.getName(), comic.getId());
            } else {
                comic = new Comic();

                comic.setName(oTruyenComic.getName());
                comic.setSlug(slug);
                comic.setOriginName(String.join(", ", oTruyenComic.getOrigin_name()));

                if ("ongoing".equals(oTruyenComic.getStatus())) {
                    comic.setStatus(ComicStatus.ONGOING);
                } else if ("completed".equals(oTruyenComic.getStatus())) {
                    comic.setStatus(ComicStatus.COMPLETED);
                } else {
                    comic.setStatus(ComicStatus.COMING_SOON);
                }

                if (oTruyenComic.getThumb_url() != null && !oTruyenComic.getThumb_url().isEmpty()) {
                    String thumbnailUrl = OTRUYEN_IMAGE_CDN + "/uploads/comics/" + oTruyenComic.getThumb_url();
                    comic.setThumbUrl(thumbnailUrl);

                    if (isSaveDrive) {
                        // TODO: Implement save to drive
                        // String folderId = googleDriveService.createFolder(slug, null);
                        // comic.setFolderId(folderId);
                    }
                }

                if (oTruyenComic.getCategory() != null && !oTruyenComic.getCategory().isEmpty()) {
                    List<Category> categories = new ArrayList<>();

                    for (var oTruyenCategory : oTruyenComic.getCategory()) {
                        String categorySlug = StringUtils.generateSlug(oTruyenCategory.getName());
                        Category category;

                        // Tìm hoặc tạo category
                        Optional<Category> existingCategory = categoryRepository.findBySlug(categorySlug);
                        if (existingCategory.isPresent()) {
                            category = existingCategory.get();
                        } else {
                            category = new Category();
                            category.setName(oTruyenCategory.getName());
                            category.setSlug(categorySlug);
                            category = categoryRepository.save(category);
                        }

                        // Chỉ lưu ID của category thay vì toàn bộ entity
                        categories.add(category);
                    }

                    // Lưu comic trước, sau đó mới set categories
                    comic = comicRepository.save(comic);

                    // Set trực tiếp vào database
                    comic.setCategories(categories);
                    comic = comicRepository.save(comic);
                }

                comic.setDescription(oTruyenComic.getContent() != null ? oTruyenComic.getContent() : "Đang cập nhật");

                comic = comicRepository.save(comic);
                log.info("Đã thêm truyện mới: {}, ID: {}", comic.getName(), comic.getId());
            }

            Thread.sleep(requestDelayMs);

            try {
                boolean anyChapterProcessed = processChapters(comicDetail, comic, restTemplate, isExistingComic,
                        progressMessage);

                return anyChapterProcessed || !isExistingComic;
            } catch (Exception e) {
                log.error("Lỗi khi xử lý chapters cho truyện {}: {}", comic.getName(), e.getMessage());
                return false;
            }
        } catch (Exception e) {
            log.error("Lỗi khi xử lý truyện: {}", e.getMessage());
            throw e;
        }
    }

    @Transactional
    private boolean processChapters(OTruyenComicDetail comicDetail, Comic comic, RestTemplate restTemplate,
            boolean isExistingComic, CrawlerProgressMessage progressMessage) throws InterruptedException {
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

        Double latestChapterNumber = null;
        if (isExistingComic) {
            latestChapterNumber = chapterRepository.findMaxChapterNumberByComicId(comic.getId());
            log.info("Chapter mới nhất của truyện {}: {}", comic.getName(),
                    latestChapterNumber != null ? latestChapterNumber : "Chưa có chapter");
        }

        int chapterProcessed = 0;
        boolean anyChapterProcessedSuccessfully = false;

        for (OTruyenChapter chapter : chapters) {
            // Kiểm tra nếu task đã bị dừng
            if (progressMessage != null && shouldStopCrawling(progressMessage.getSessionId())) {
                log.info("Tiến trình xử lý chapter đã bị dừng cho session: {}", progressMessage.getSessionId());
                return anyChapterProcessedSuccessfully;
            }

            Thread.sleep(requestDelayMs);

            double chapterNumber;
            try {
                chapterNumber = NumberUtils.parseStringToDouble(chapter.getChapter_name());

                if (isExistingComic && latestChapterNumber != null && chapterNumber <= latestChapterNumber) {
                    log.debug("Bỏ qua chapter {} vì đã tồn tại", chapterNumber);
                    continue;
                }
            } catch (NumberFormatException e) {
                log.error("Không thể phân tích chapter number: " + chapter.getChapter_name(), e);
                continue;
            }

            boolean chapterSuccess = processChapter(chapter, comic, restTemplate, latestChapterNumber, isExistingComic,
                    progressMessage);
            if (chapterSuccess) {
                anyChapterProcessedSuccessfully = true;
            }

            chapterProcessed++;
            if (progressMessage != null) {
                progressMessage.setCurrentComicChaptersProcessed(chapterProcessed);
                sendProgressUpdate(progressMessage);
            }

            if (chapterProcessed % batchSize == 0) {
                log.info("Đã xử lý {} chapter cho truyện {}, đang tạm nghỉ...",
                        chapterProcessed, comic.getName());
                Thread.sleep(batchDelayMs);
            }
        }

        return anyChapterProcessedSuccessfully;
    }

    @Transactional
    private boolean processChapter(OTruyenChapter chapter, Comic comic, RestTemplate restTemplate,
            Double latestChapterNumber, boolean isExistingComic, CrawlerProgressMessage progressMessage)
            throws InterruptedException {
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

        OTruyenChapterDetail chapterDetail = fetchChapterDetail(chapter.getChapter_api_data(), restTemplate);
        if (chapterDetail == null) {
            return false;
        }

        Chapter chapterNew = saveNewChapter(chapter, chapterNumber, comic, chapterDetail);

        List<ChapterImage> chapterImages = chapterDetail.getData().getItem().getChapter_image();
        processChapterDetail(chapterImages, chapterNew);

        // Cập nhật thông tin chapter đã crawl xong cho frontend
        if (progressMessage != null) {
            Map<String, Object> chapterInfo = new HashMap<>();
            chapterInfo.put("comicName", comic.getName());
            chapterInfo.put("comicId", comic.getId());
            chapterInfo.put("chapterNumber", chapterNumber);
            chapterInfo.put("chapterId", chapterNew.getId());
            chapterInfo.put("chapterTitle", chapterNew.getTitle());
            chapterInfo.put("imageCount", chapterImages.size());

            progressMessage.setLastCompletedChapter(chapterInfo);
            sendProgressUpdate(progressMessage);
        }

        return true;
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
            OTruyenChapterDetail chapterDetail) {
        String domainCdn = chapterDetail.getData().getDomain_cdn();
        String chapterPath = chapterDetail.getData().getItem().getChapter_path();

        Chapter chapterNew = Chapter.builder()
                .chapterNumber(chapterNumber)
                .title(chapter.getFilename())
                .status(ChapterStatus.FREE)
                .comic(comic)
                .domainCdn(domainCdn)
                .chapterPath(chapterPath)
                .build();
        chapterRepository.save(chapterNew);
        log.info("Đã thêm chapter mới: {} cho truyện: {}", chapterNumber, comic.getName());

        return chapterNew;
    }

    @Transactional
    private void processChapterDetail(List<ChapterImage> chapterImage, Chapter chapterNew) {
        List<DetailChapter> detailChapters = new ArrayList<>();
        for (ChapterImage chapterImageItem : chapterImage) {
            DetailChapter detailChapter = DetailChapter.builder()
                    .orderNumber(chapterImageItem.getImage_page())
                    .imgUrl(chapterImageItem.getImage_file())
                    .chapter(chapterNew)
                    .build();

            detailChapters.add(detailChapter);
        }

        detailChapterRepository.saveAll(detailChapters);

        log.info("Đã thêm {} ảnh cho chapter {} của truyện: {}",
                detailChapters.size(),
                chapterNew.getChapterNumber(),
                chapterNew.getComic().getName());
    }

    /**
     * Phiên bản bất đồng bộ của crawlComic để sử dụng với WebSocket
     */
    public void crawlComicAsync(CrawlerComicRequest request, CrawlerProgressMessage progressMessage) {
        try {
            // Gọi phương thức đồng bộ với progressMessage
            BaseResponse<?> response = crawlComic(request, progressMessage);

            // Cập nhật kết quả vào progressMessage nếu cần
            if (response.getStatus() == 200) {
                progressMessage.setStatus(CrawlerStatus.COMPLETED);
            } else {
                progressMessage.setStatus(CrawlerStatus.ERROR);
                progressMessage.addError("crawler", "Có lỗi xảy ra trong quá trình crawl");
            }
        } catch (Exception e) {
            log.error("Lỗi khi crawl comic bất đồng bộ", e);
            progressMessage.setStatus(CrawlerStatus.ERROR);
            progressMessage.addError("crawler", e.getMessage());
        } finally {
            // Đảm bảo gửi thông báo cuối cùng
            sendProgressUpdate(progressMessage);
        }
    }

    // Dừng tại dòng này để tránh nhầm lẫn
    public void crawlComicWithProgress(CrawlerComicRequest request, CrawlerProgressMessage progressMessage) {
        // Phương thức này không cần thiết nữa, sử dụng crawlComicAsync thay thế
        try {
            crawlComic(request, progressMessage);
        } catch (Exception e) {
            progressMessage.setStatus(CrawlerStatus.ERROR);
            progressMessage.addError("crawler", e.getMessage());
            sendProgressUpdate(progressMessage);
        }
    }

    private boolean shouldStopCrawling(String sessionId) {
        CrawlerTask task = activeTasks.get(sessionId);
        return task == null || task.isStopped();
    }

}