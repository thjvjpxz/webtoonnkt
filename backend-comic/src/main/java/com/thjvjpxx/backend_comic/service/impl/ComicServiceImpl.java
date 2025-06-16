package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ComicResponse;
import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.ComicService;
import com.thjvjpxx.backend_comic.utils.ComicUtils;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.StorageUtils;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ComicServiceImpl implements ComicService {
    ComicRepository comicRepository;

    // Utility classes
    ComicUtils comicUtils;
    StorageUtils storageUtils;

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
                .map(comicUtils::convertComicToComicResponse)
                .collect(Collectors.toList());

        return BaseResponse.success(
                comicResponses,
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<Comic> createComic(ComicRequest comicRequest, MultipartFile cover, User publisher) {
        // Validate slug uniqueness
        comicUtils.validateSlugUniqueness(comicRequest.getSlug());

        // Validate và lấy categories
        List<Category> categories = comicUtils.validateAndGetCategories(comicRequest.getCategories());

        // Handle cover upload
        String thumbUrl = storageUtils.uploadThumbnail(cover, comicRequest.getSlug());

        Comic comic = Comic.builder()
                .name(comicRequest.getName())
                .slug(comicRequest.getSlug())
                .originName(comicRequest.getOriginName())
                .author(comicRequest.getAuthor())
                .description(comicRequest.getDescription())
                .thumbUrl(thumbUrl)
                .status(ComicStatus.valueOf(comicRequest.getStatus()))
                .publisher(publisher)
                .categories(categories) // nếu có
                .build();

        comicRepository.save(comic);
        return BaseResponse.success(comic);
    }

    @Override
    public BaseResponse<Comic> updateComic(String id, ComicRequest comicRequest, MultipartFile cover, User publisher) {
        if (publisher != null) {
            comicUtils.validateComicOwnershipByComicId(publisher, id);
        }

        ValidationUtils.checkNullId(id);

        Comic comic = comicUtils.findComicById(id);

        // Validate slug nếu có thay đổi
        if (comicRequest.getIsSlugChanged()) {
            comicUtils.validateSlugUniquenessForUpdate(id, comicRequest.getSlug());
        }

        // Xử lý thumbnail với logic được tối ưu
        String newThumbUrl = handleThumbnailUpdateOptimized(comic, comicRequest, cover);

        // Cập nhật categories chỉ khi cần thiết
        if (comicRequest.getIsCategoriesChanged()) {
            comicUtils.updateComicCategories(comic, comicRequest.getCategories());
        }

        // Cập nhật thông tin comic
        updateComicFields(comic, comicRequest, newThumbUrl);

        comicRepository.save(comic);
        return BaseResponse.success(comic);
    }

    @Override
    public BaseResponse<Comic> deleteComic(String id, User publisher) {
        if (publisher != null) {
            comicUtils.validateComicOwnershipByComicId(publisher, id);
        }

        ValidationUtils.checkNullId(id);

        Comic comic = comicUtils.findComicById(id);

        // Xóa tất cả categories
        comicUtils.removeAllCategories(comic);

        // Xóa thumbnail từ storage
        storageUtils.removeOldThumbnail(comic.getThumbUrl());

        try {
            comicRepository.delete(comic);
        } catch (DataIntegrityViolationException e) {
            throw new BaseException(ErrorCode.COMIC_HAS_CHAPTERS);
        } catch (Exception e) {
            throw new BaseException(ErrorCode.HAS_ERROR);
        }

        return BaseResponse.success(comic);
    }

    // ====================== HELPER METHODS ======================

    /**
     * Xử lý cập nhật thumbnail được tối ưu với flag
     */
    private String handleThumbnailUpdateOptimized(Comic comic, ComicRequest comicRequest, MultipartFile cover) {
        String currentThumbUrl = comic.getThumbUrl();

        // Trường hợp 1: Có file upload mới
        if (cover != null && !cover.isEmpty()) {
            return storageUtils.handleNewImageUpload(currentThumbUrl, comicRequest.getSlug(), cover,
                    comicRequest.getIsSlugChanged());
        }

        // Trường hợp 2: Muốn xóa thumbnail hiện tại
        if (comicRequest.getShouldRemoveThumbnail()) {
            storageUtils.removeOldThumbnail(currentThumbUrl);
            return null;
        }

        // Trường hợp 3: URL trong request thay đổi
        if (comicRequest.getIsThumbUrlChanged()) {
            // Xóa image cũ nếu có
            storageUtils.removeOldThumbnail(currentThumbUrl);
            return comicRequest.getThumbUrl();
        }

        // Trường hợp 4: Chỉ slug thay đổi, cần rename file
        if (comicRequest.getIsSlugChanged() && storageUtils.isB2StorageUrl(currentThumbUrl)) {
            return storageUtils.renameThumbnail(currentThumbUrl, comicRequest.getSlug());
        }

        // Trường hợp 5: Không có thay đổi gì
        return currentThumbUrl;
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

}
