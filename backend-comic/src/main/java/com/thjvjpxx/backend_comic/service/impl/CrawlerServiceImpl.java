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

    @Value("${crawler.otruyen-api-url}")
    String OTRUYEN_API_URL;

    @Value("${crawler.otruyen-api-comic-detail}")
    String OTRUYEN_API_COMIC_DETAIL;

    @Value("${crawler.otruyen-image-cdn}")
    String OTRUYEN_IMAGE_CDN;

    @Override
    @Transactional
    public BaseResponse<?> crawlComic(CrawlerComicRequest request) {
        try {
            List<Map<String, Object>> allResults = new ArrayList<>();
            RestTemplate restTemplate = new RestTemplate();

            for (int currentPage = request.getStartPage(); currentPage <= request.getEndPage(); currentPage++) {
                log.info("Crawling page {} of {}", currentPage, request.getEndPage());

                ResponseEntity<OTruyenResponse> responseEntity = restTemplate.getForEntity(
                        OTRUYEN_API_URL + currentPage, OTruyenResponse.class);

                if (responseEntity.getStatusCode() != HttpStatus.OK || responseEntity.getBody() == null) {
                    log.error("Failed to fetch data from OTruyen API for page {}", currentPage);
                    continue;
                }

                OTruyenResponse response = responseEntity.getBody();
                List<OTruyenComic> comics = response.getData().getItems();

                if (comics == null || comics.isEmpty()) {
                    log.warn("No comics found on page {}", currentPage);
                    continue;
                }

                // Chỉ lấy slug từ danh sách truyện
                for (OTruyenComic comicSummary : comics) {
                    try {
                        String slug = comicSummary.getSlug();
                        if (slug == null || slug.isEmpty()) {
                            continue;
                        }

                        // Gọi API chi tiết truyện trực tiếp với URL đầy đủ
                        ResponseEntity<OTruyenComicDetail> comicDetailResponse = restTemplate
                                .getForEntity(OTRUYEN_API_COMIC_DETAIL + slug, OTruyenComicDetail.class);

                        if (comicDetailResponse.getStatusCode() != HttpStatus.OK
                                || comicDetailResponse.getBody() == null) {
                            log.error("Failed to fetch detail for comic: {}", slug);
                            continue;
                        }

                        OTruyenComicDetail comicDetail = comicDetailResponse.getBody();
                        processComicWithChapters(comicDetail, request.isSaveDrive(), restTemplate);
                    } catch (Exception e) {
                        log.error("Failed to process comic with slug: " + comicSummary.getSlug(), e);
                        Map<String, Object> errorResult = new HashMap<>();
                        errorResult.put("comicSlug", comicSummary.getSlug());
                        errorResult.put("error", e.getMessage());
                        allResults.add(errorResult);
                    }
                }

                log.info("Completed crawling page {} with {} comics", currentPage, comics.size());
            }

            return BaseResponse.success(allResults);
        } catch (Exception e) {
            log.error("Failed to crawl comics", e);
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    private void processComicWithChapters(OTruyenComicDetail comicDetail, boolean isSaveDrive,
            RestTemplate restTemplate) {
        ComicItem oTruyenComic = comicDetail.getData().getItem();

        // Kiểm tra xem truyện đã tồn tại chưa
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

            // Xử lý status
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
                comic.setThumbUrl(thumbnailUrl);

                // Chỉ tạo folder trên Google Drive nếu isSaveDrive là true
                if (isSaveDrive) {
                    String folderId = googleDriveService.createFolder(slug, null);
                    comic.setFolderId(folderId);
                }
            }

            // Xử lý thể loại
            if (oTruyenComic.getCategory() != null && !oTruyenComic.getCategory().isEmpty()) {
                Set<Category> categories = new HashSet<>();
                List<String> categoryNames = new ArrayList<>();

                for (var oTruyenCategory : oTruyenComic.getCategory()) {
                    categoryNames.add(oTruyenCategory.getName());

                    // Tìm category trong DB hoặc tạo mới
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

        processChapter(comicDetail, comic, restTemplate, isExistingComic);
    }

    @Transactional
    private void processChapter(OTruyenComicDetail comicDetail, Comic comic, RestTemplate restTemplate,
            boolean isExistingComic) {
        // Kiểm tra danh sách chapters có tồn tại và không rỗng
        List<OTruyenChapter> chapters = new ArrayList<>();
        if (comicDetail.getData().getItem().getChapters() != null &&
                !comicDetail.getData().getItem().getChapters().isEmpty()) {
            // Kiểm tra tiếp server_data có tồn tại không
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

        // Nếu truyện đã tồn tại, tìm chapter có số lớn nhất
        Double latestChapterNumber = null;
        if (isExistingComic) {
            latestChapterNumber = chapterRepository.findMaxChapterNumberByComicId(comic.getId());
            log.info("Chapter mới nhất của truyện {}: {}", comic.getName(),
                    latestChapterNumber != null ? latestChapterNumber : "Chưa có chapter");
        }

        for (OTruyenChapter chapter : chapters) {
            double chapterNumber;
            try {
                // Chuyển đổi chapterName thành số thập phân
                String chapterName = chapter.getChapter_name();
                // Chuẩn hóa chuỗi số: thay thế dấu phẩy bằng dấu chấm nếu có
                chapterName = chapterName.replace(',', '.');
                chapterNumber = Double.parseDouble(chapterName);

                // Nếu truyện đã tồn tại và chapter này nhỏ hơn hoặc bằng chapter mới nhất, bỏ
                // qua
                if (isExistingComic && latestChapterNumber != null && chapterNumber <= latestChapterNumber) {
                    log.debug("Bỏ qua chapter {} vì đã tồn tại", chapterNumber);
                    continue;
                }

                // Kiểm tra xem chapter đã tồn tại chưa để tránh trùng lặp
                Optional<Chapter> existingChapter = chapterRepository.findByComicIdAndChapterNumber(comic.getId(),
                        chapterNumber);
                if (existingChapter.isPresent()) {
                    log.debug("Bỏ qua chapter {} vì đã tồn tại", chapterNumber);
                    continue;
                }
            } catch (NumberFormatException e) {
                log.error("Failed to parse chapter number: " + chapter.getChapter_name(), e);
                continue;
            }

            String chapterApiData = chapter.getChapter_api_data();
            ResponseEntity<OTruyenChapterDetail> chapterDetailResponse = restTemplate
                    .getForEntity(chapterApiData, OTruyenChapterDetail.class);

            if (chapterDetailResponse.getStatusCode() != HttpStatus.OK || chapterDetailResponse.getBody() == null) {
                log.error("Failed to fetch detail for chapter: {}", chapterApiData);
                continue;
            }

            String domainCdn = chapterDetailResponse.getBody().getData().getDomain_cdn();
            String chapterPath = chapterDetailResponse.getBody().getData().getItem().getChapter_path();

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

            List<ChapterImage> chapterImage = chapterDetailResponse
                    .getBody()
                    .getData()
                    .getItem()
                    .getChapter_image();

            processChapterDetail(chapterImage, chapterNew);
        }
    }

    @Transactional
    private void processChapterDetail(List<ChapterImage> chapterImage, Chapter chapterNew) {
        for (ChapterImage chapterImageItem : chapterImage) {
            DetailChapter detailChapter = DetailChapter.builder()
                    .orderNumber(chapterImageItem.getImage_page())
                    .imgUrl(chapterImageItem.getImage_file())
                    .chapter(chapterNew)
                    .build();

            detailChapterRepository.save(detailChapter);
        }
    }

}