package com.thjvjpxx.backend_comic.service.impl;

import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenComic;
import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenResponse;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.CrawlerService;
import com.thjvjpxx.backend_comic.service.GoogleDriveService;
import com.thjvjpxx.backend_comic.utils.StringUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CrawlerServiceImpl implements CrawlerService {

    ComicRepository comicRepository;
    CategoryRepository categoryRepository;
    GoogleDriveService googleDriveService;

    private static final String OTRUYEN_API_URL = "https://otruyenapi.com/v1/api/home";
    private static final String OTRUYEN_IMAGE_CDN = "https://img.otruyenapi.com";

    @Override
    public BaseResponse<?> crawlComic() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<OTruyenResponse> responseEntity = restTemplate.getForEntity(OTRUYEN_API_URL,
                    OTruyenResponse.class);

            if (responseEntity.getStatusCode() != HttpStatus.OK || responseEntity.getBody() == null) {
                log.error("Failed to fetch data from OTruyen API");
                throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
            }

            OTruyenResponse response = responseEntity.getBody();
            List<OTruyenComic> comics = response.getData().getItems();

            List<Map<String, Object>> results = new ArrayList<>();
            for (OTruyenComic oTruyenComic : comics) {
                try {
                    Map<String, Object> result = processComic(oTruyenComic);
                    results.add(result);
                } catch (Exception e) {
                    log.error("Failed to process comic: " + oTruyenComic.getName(), e);
                    Map<String, Object> errorResult = new HashMap<>();
                    errorResult.put("comicName", oTruyenComic.getName());
                    errorResult.put("error", e.getMessage());
                    results.add(errorResult);
                }
            }

            return BaseResponse.success(results);
        } catch (Exception e) {
            log.error("Failed to crawl comics", e);
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    private Map<String, Object> processComic(OTruyenComic oTruyenComic) {
        Map<String, Object> result = new HashMap<>();
        result.put("comicName", oTruyenComic.getName());

        // Kiểm tra xem truyện đã tồn tại chưa
        String slug = StringUtils.generateSlug(oTruyenComic.getName());
        Optional<Comic> existingComic = comicRepository.findBySlug(slug);

        if (existingComic.isPresent()) {
            result.put("status", "existing");
            result.put("message", "Comic already exists");
            return result;
        }

        // Tạo mới Comic
        Comic comic = new Comic();
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
            result.put("originalThumbnailUrl", thumbnailUrl);

            // Tạo folder cho comic trên Google Drive
            String folderId = googleDriveService.createFolder(slug, null);
            comic.setFolderId(folderId);

            // TODO: Download và upload thumbnail lên Google Drive
            // Đây là phần phức tạp cần triển khai thêm
            // Sẽ cần lấy ảnh từ URL và upload lên Google Drive
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
            result.put("categories", categoryNames);
        }

        comic.setDescription("Đang cập nhật"); // Default description

        // Lưu comic vào DB
        comic = comicRepository.save(comic);

        result.put("status", "success");
        result.put("message", "Comic added successfully");
        result.put("comicId", comic.getId());

        // Trong phiên bản đầy đủ, bạn có thể tiếp tục crawl chapters từ chaptersLatest
        // của OTruyenComic, nhưng cần thêm API calls và xử lý phức tạp hơn

        return result;
    }
}