package com.thjvjpxx.backend_comic.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.dto.response.ComicResponse;
import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.ComicService;
import com.thjvjpxx.backend_comic.service.StorageService;
import com.thjvjpxx.backend_comic.utils.FileUtils;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.StringUtils;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ComicServiceImpl implements ComicService {
    ComicRepository comicRepository;
    CategoryRepository categoryRepository;
    StorageService b2StorageService;
    ChapterRepository chapterRepository;

    @Override
    public BaseResponse<?> getAllComics(int page, int limit, String search, String status, String category) {
        Pageable pageable = PaginationUtils.createPageableWithSort(page, limit, "updatedAt", Sort.Direction.DESC);
        int originalPage = page;
        Page<Comic> comics = null;
        if (search != null && !search.isEmpty()) {
            comics = comicRepository.findBySlugContainingOrNameContaining(search, search, pageable);
        } else if (status != null && !status.isEmpty()) {
            ComicStatus comicStatus = ComicStatus.valueOf(status.toUpperCase());
            comics = comicRepository.findByStatus(comicStatus, pageable);
        } else if (category != null && !category.isEmpty()) {
            comics = comicRepository.findByCategory(category, pageable);
        } else {
            comics = comicRepository.findAll(pageable);
        }

        List<ComicResponse> comicResponses = comics.getContent().stream()
                .map(comic -> ComicResponse.builder()
                        .id(comic.getId())
                        .name(comic.getName())
                        .slug(comic.getSlug())
                        .originName(comic.getOriginName())
                        .thumbUrl(comic.getThumbUrl())
                        .author(comic.getAuthor())
                        .status(comic.getStatus())
                        .followersCount(comic.getFollowersCount())
                        .viewsCount(comic.getViewsCount())
                        .description(comic.getDescription())
                        .publisherUserName(comic.getPublisher() != null ? comic.getPublisher().getUsername() : null)
                        .categories(comic.getCategories())
                        .createdAt(comic.getCreatedAt().toString())
                        .updatedAt(comic.getUpdatedAt().toString())
                        .build())
                .collect(Collectors.toList());

        return BaseResponse.success(
                comicResponses,
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<Comic> createComic(ComicRequest comicRequest, MultipartFile cover) {
        validateComicRequest(comicRequest);
        String thumbUrl = null;
        if (cover != null) {
            var response = b2StorageService.uploadFile(
                    cover,
                    B2Constants.FOLDER_KEY_THUMBNAIL,
                    comicRequest.getSlug() + "_thumb." + StringUtils.getExtension(cover.getOriginalFilename()));
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            thumbUrl = response.getMessage();
        }

        Comic comic = Comic.builder()
                .name(comicRequest.getName())
                .slug(comicRequest.getSlug())
                .originName(comicRequest.getOriginName())
                .thumbUrl(thumbUrl)
                .author(comicRequest.getAuthor())
                .status(ComicStatus.valueOf(comicRequest.getStatus()))
                .description(comicRequest.getDescription())
                .categories(convertCategories(comicRequest.getCategories()))
                .build();

        comicRepository.save(comic);
        return BaseResponse.success(comic);
    }

    private List<Category> convertCategories(List<String> categories) {
        return categories.stream().map(
                category -> categoryRepository.findById(category)
                        .orElseThrow(() -> new BaseException(ErrorCode.CATEGORY_NOT_FOUND)))
                .collect(Collectors.toList());
    }

    private void validateComicRequest(ComicRequest comicRequest) {
        comicRepository.findBySlug(comicRequest.getSlug()).ifPresent(comic -> {
            throw new BaseException(ErrorCode.COMIC_SLUG_EXISTS);
        });
    }

    /**
     * Validate comic request cho update (loại trừ comic hiện tại)
     */
    private void validateComicUpdateRequest(String currentComicId, ComicRequest comicRequest) {
        comicRepository.findBySlug(comicRequest.getSlug())
                .filter(comic -> !comic.getId().equals(currentComicId))
                .ifPresent(comic -> {
                    throw new BaseException(ErrorCode.COMIC_SLUG_EXISTS);
                });
    }

    @Override
    public BaseResponse<Comic> updateComic(String id, ComicRequest comicRequest, MultipartFile cover) {
        ValidationUtils.checkNullId(id);

        Comic comic = findComicById(id);

        // Validate slug nếu có thay đổi
        if (comicRequest.getIsSlugChanged()) {
            validateComicUpdateRequest(id, comicRequest);
        }

        // Xử lý thumbnail với logic được tối ưu
        String newThumbUrl = handleThumbnailUpdateOptimized(comic, comicRequest, cover);

        // Cập nhật categories chỉ khi cần thiết
        if (comicRequest.getIsCategoriesChanged()) {
            updateComicCategories(comic, comicRequest);
        }

        // Cập nhật thông tin comic
        updateComicFields(comic, comicRequest, newThumbUrl);

        comicRepository.save(comic);
        return BaseResponse.success(comic);
    }

    /**
     * Xử lý cập nhật thumbnail được tối ưu với flag
     */
    private String handleThumbnailUpdateOptimized(Comic comic, ComicRequest comicRequest, MultipartFile cover) {
        String currentThumbUrl = comic.getThumbUrl();

        // Trường hợp 1: Có file upload mới
        if (cover != null && !cover.isEmpty()) {
            return handleNewImageUpload(currentThumbUrl, comicRequest, cover);
        }

        // Trường hợp 2: Muốn xóa thumbnail hiện tại
        if (comicRequest.getShouldRemoveThumbnail()) {
            removeOldThumbnail(currentThumbUrl);
            return null;
        }

        // Trường hợp 3: URL trong request thay đổi
        if (comicRequest.getIsThumbUrlChanged()) {
            // Xóa image cũ nếu có
            removeOldThumbnail(currentThumbUrl);
            return comicRequest.getThumbUrl();
        }

        // Trường hợp 4: Chỉ slug thay đổi, cần rename file
        if (comicRequest.getIsSlugChanged() &&
                currentThumbUrl != null && !currentThumbUrl.isEmpty()) {
            return renameThumbnail(currentThumbUrl, comicRequest.getSlug());
        }

        // Trường hợp 5: Không có thay đổi gì
        return currentThumbUrl;
    }

    /**
     * Xử lý upload file mới
     */
    private String handleNewImageUpload(String currentThumbUrl, ComicRequest comicRequest, MultipartFile cover) {
        // Xóa ảnh cũ nếu có và slug thay đổi
        if (comicRequest.getIsSlugChanged()) {
            removeOldThumbnail(currentThumbUrl);
        }

        // Upload ảnh mới
        return uploadNewThumbnail(cover, comicRequest.getSlug());
    }

    /**
     * Rename thumbnail
     */
    private String renameThumbnail(String currentThumbUrl, String newSlug) {
        var response = b2StorageService.rename(currentThumbUrl, newSlug + "_thumb");
        if (response.getStatus() != HttpStatus.OK.value()) {
            throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
        }
        return response.getMessage();
    }

    /**
     * Xóa thumbnail cũ
     */
    private void removeOldThumbnail(String thumbUrl) {
        if (thumbUrl != null && !thumbUrl.isEmpty() && thumbUrl.startsWith(B2Constants.URL_PREFIX)) {
            var response = b2StorageService.remove(thumbUrl);
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
        }
    }

    /**
     * Upload thumbnail mới
     */
    private String uploadNewThumbnail(MultipartFile cover, String slug) {
        var response = b2StorageService.uploadFile(
                cover,
                B2Constants.FOLDER_KEY_THUMBNAIL,
                slug + "_thumb." + StringUtils.getExtension(cover.getOriginalFilename()));
        if (response.getStatus() != HttpStatus.OK.value()) {
            throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
        }
        return response.getMessage();
    }

    /**
     * Cập nhật categories của comic với tối ưu hóa
     */
    private void updateComicCategories(Comic comic, ComicRequest comicRequest) {
        // Validate categories trước khi thực hiện thay đổi
        List<Category> newCategories = categoryRepository.findAllById(comicRequest.getCategories());
        if (newCategories.size() != comicRequest.getCategories().size()) {
            throw new BaseException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // Thực hiện update categories
        comic.removeCategories(new ArrayList<>(comic.getCategories()));
        comic.addCategories(newCategories);
    }

    /**
     * Cập nhật các field của comic
     */
    private void updateComicFields(Comic comic, ComicRequest comicRequest, String thumbUrl) {
        comic.setSlug(comicRequest.getSlug());
        comic.setName(comicRequest.getName());
        comic.setDescription(comicRequest.getDescription());
        comic.setAuthor(comicRequest.getAuthor());
        comic.setStatus(ComicStatus.valueOf(comicRequest.getStatus()));
        comic.setThumbUrl(thumbUrl);
        comic.setOriginName(comicRequest.getOriginName());
    }

    private Comic findComicById(String id) {
        ValidationUtils.checkNullId(id);
        return comicRepository.findById(id).orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));
    }

    @Override
    public BaseResponse<Comic> deleteComic(String id) {
        ValidationUtils.checkNullId(id);

        Comic comic = findComicById(id);

        comic.removeCategories(new ArrayList<>(comic.getCategories()));

        FileUtils.deleteFileFromB2(comic.getThumbUrl(), b2StorageService);

        try {
            comicRepository.delete(comic);
        } catch (DataIntegrityViolationException e) {
            throw new BaseException(ErrorCode.COMIC_HAS_CHAPTERS);
        } catch (Exception e) {
            throw new BaseException(ErrorCode.HAS_ERROR);
        }

        return BaseResponse.success(comic);
    }

    @Override
    public BaseResponse<List<ChapterResponse>> getAllChapters(int page, int limit, String search, String status,
            String comicId) {
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        int originalPage = page;
        Page<Chapter> chapters = null;
        if (search != null && !search.isEmpty()) {
            chapters = chapterRepository.findByComicIdAndTitleContaining(comicId, search, pageable);
        } else if (status != null && !status.isEmpty()) {
            chapters = chapterRepository.findByComicIdAndStatus(comicId, status, pageable);
        } else {
            chapters = chapterRepository.findByComicId(comicId, pageable);
        }

        List<ChapterResponse> chapterResponses = chapters.getContent().stream()
                .map(chapter -> ChapterResponse.builder()
                        .id(chapter.getId())
                        .title(chapter.getTitle())
                        .chapterNumber(chapter.getChapterNumber())
                        .status(chapter.getStatus())
                        .createdAt(chapter.getCreatedAt().toString())
                        .updatedAt(chapter.getUpdatedAt().toString())
                        .build())
                .collect(Collectors.toList());

        return BaseResponse.success(
                chapterResponses,
                originalPage,
                (int) chapters.getTotalElements(),
                limit,
                chapters.getTotalPages());
    }

}
