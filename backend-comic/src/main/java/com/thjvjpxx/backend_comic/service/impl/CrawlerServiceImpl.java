package com.thjvjpxx.backend_comic.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.thjvjpxx.backend_comic.service.GoogleDriveService;
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
    final GoogleDriveService googleDriveService;
    final DetailChapterRepository detailChapterRepository;

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

    @Override
    @Transactional
    public BaseResponse<?> crawlComic(CrawlerComicRequest request) {
        try {
            List<Map<String, Object>> allResults = new ArrayList<>();
            RestTemplate restTemplate = new RestTemplate();
            int comicProcessed = 0;

            for (int currentPage = request.getStartPage(); currentPage <= request.getEndPage(); currentPage++) {
                log.info("Đang crawl trang {} / {}", currentPage, request.getEndPage());

                if (currentPage > request.getStartPage()) {
                    Thread.sleep(batchDelayMs);
                }

                ResponseEntity<OTruyenResponse> responseEntity = restTemplate.getForEntity(
                        OTRUYEN_API_URL + currentPage, OTruyenResponse.class);

                if (responseEntity.getStatusCode() != HttpStatus.OK || responseEntity.getBody() == null) {
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
                    try {
                        Thread.sleep(requestDelayMs);

                        String slug = comicSummary.getSlug();
                        if (slug == null || slug.isEmpty()) {
                            continue;
                        }

                        ResponseEntity<OTruyenComicDetail> comicDetailResponse = restTemplate
                                .getForEntity(OTRUYEN_API_COMIC_DETAIL + slug, OTruyenComicDetail.class);

                        if (comicDetailResponse.getStatusCode() != HttpStatus.OK
                                || comicDetailResponse.getBody() == null) {
                            log.error("Không thể lấy chi tiết cho truyện: {}", slug);
                            continue;
                        }

                        OTruyenComicDetail comicDetail = comicDetailResponse.getBody();
                        processComicWithChapters(comicDetail, request.isSaveDrive(), restTemplate);

                        comicProcessed++;

                        if (comicProcessed % batchSize == 0) {
                            log.info("Đã xử lý {} truyện, đang tạm nghỉ...", comicProcessed);
                            Thread.sleep(batchDelayMs);
                        }
                    } catch (Exception e) {
                        log.error("Lỗi khi xử lý truyện với slug: " + comicSummary.getSlug(), e);
                        Map<String, Object> errorResult = new HashMap<>();
                        errorResult.put("comicSlug", comicSummary.getSlug());
                        errorResult.put("error", e.getMessage());
                        allResults.add(errorResult);
                    }
                }

                log.info("Hoàn thành crawl trang {} với {} truyện", currentPage, comics.size());
            }

            return BaseResponse.success(allResults);
        } catch (InterruptedException e) {
            log.error("Quá trình crawl bị gián đoạn", e);
            Thread.currentThread().interrupt();
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Lỗi khi crawl truyện", e);
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    private void processComicWithChapters(OTruyenComicDetail comicDetail, boolean isSaveDrive,
            RestTemplate restTemplate) throws InterruptedException {
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
                    String folderId = googleDriveService.createFolder(slug, null);
                    comic.setFolderId(folderId);
                }
            }

            if (oTruyenComic.getCategory() != null && !oTruyenComic.getCategory().isEmpty()) {
                Set<Category> categories = new HashSet<>();
                List<String> categoryNames = new ArrayList<>();

                for (var oTruyenCategory : oTruyenComic.getCategory()) {
                    categoryNames.add(oTruyenCategory.getName());

                    String categorySlug = StringUtils.generateSlug(oTruyenCategory.getName());
                    Optional<Category> existingCategory = categoryRepository.findBySlug(categorySlug);

                    if (existingCategory.isPresent()) {
                        categories.add(existingCategory.get());
                    } else {
                        Category newCategory = new Category();
                        newCategory.setName(oTruyenCategory.getName());
                        newCategory.setSlug(categorySlug);
                        categoryRepository.save(newCategory);
                        categories.add(newCategory);
                    }
                }

                comic.setCategories(categories);
            }

            comic.setDescription(oTruyenComic.getContent() != null ? oTruyenComic.getContent() : "Đang cập nhật");

            comic = comicRepository.save(comic);
            log.info("Đã thêm truyện mới: {}, ID: {}", comic.getName(), comic.getId());
        }

        Thread.sleep(requestDelayMs);
        processChapters(comicDetail, comic, restTemplate, isExistingComic);
    }

    @Transactional
    private void processChapters(OTruyenComicDetail comicDetail, Comic comic, RestTemplate restTemplate,
            boolean isExistingComic) throws InterruptedException {
        List<OTruyenChapter> chapters = new ArrayList<>();
        if (comicDetail.getData().getItem().getChapters() != null &&
                !comicDetail.getData().getItem().getChapters().isEmpty()) {
            if (comicDetail.getData().getItem().getChapters().get(0) != null &&
                    comicDetail.getData().getItem().getChapters().get(0).getServer_data() != null) {
                chapters = comicDetail.getData().getItem().getChapters().get(0).getServer_data();
            } else {
                log.warn("Không có server_data cho truyện: {}", comic.getName());
                return;
            }
        } else {
            log.warn("Không có chapter nào cho truyện: {}", comic.getName());
            return;
        }

        Double latestChapterNumber = null;
        if (isExistingComic) {
            latestChapterNumber = chapterRepository.findMaxChapterNumberByComicId(comic.getId());
            log.info("Chapter mới nhất của truyện {}: {}", comic.getName(),
                    latestChapterNumber != null ? latestChapterNumber : "Chưa có chapter");
        }

        int chapterProcessed = 0;
        for (OTruyenChapter chapter : chapters) {
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

            processChapter(chapter, comic, restTemplate, latestChapterNumber, isExistingComic);

            chapterProcessed++;

            if (chapterProcessed % batchSize == 0) {
                log.info("Đã xử lý {} chapter cho truyện {}, đang tạm nghỉ...",
                        chapterProcessed, comic.getName());
                Thread.sleep(batchDelayMs);
            }
        }
    }

    @Transactional
    private void processChapter(OTruyenChapter chapter, Comic comic, RestTemplate restTemplate,
            Double latestChapterNumber, boolean isExistingComic) throws InterruptedException {
        double chapterNumber;
        try {
            chapterNumber = NumberUtils.parseStringToDouble(chapter.getChapter_name());

            if (shouldSkipChapter(comic.getId(), chapterNumber, latestChapterNumber, isExistingComic)) {
                return;
            }
        } catch (NumberFormatException e) {
            log.error("Không thể phân tích chapter number: " + chapter.getChapter_name(), e);
            return;
        }

        OTruyenChapterDetail chapterDetail = fetchChapterDetail(chapter.getChapter_api_data(), restTemplate);
        if (chapterDetail == null) {
            return;
        }

        Chapter chapterNew = saveNewChapter(chapter, chapterNumber, comic, chapterDetail);

        List<ChapterImage> chapterImages = chapterDetail.getData().getItem().getChapter_image();
        processChapterDetail(chapterImages, chapterNew);
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

}