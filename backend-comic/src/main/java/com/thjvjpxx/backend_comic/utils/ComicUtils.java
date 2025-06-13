package com.thjvjpxx.backend_comic.utils;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.thjvjpxx.backend_comic.dto.response.ComicResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * Utility class chứa các helper methods chung cho Comic operations
 */
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ComicUtils {

    ComicRepository comicRepository;
    CategoryRepository categoryRepository;
    ChapterRepository chapterRepository;

    /**
     * Tìm Comic theo ID với validation
     */
    public Comic findComicById(String comicId) {
        ValidationUtils.checkNullId(comicId);
        return comicRepository.findById(comicId)
                .orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));
    }

    /**
     * Tìm Chapter theo ID với validation
     */
    public Chapter findChapterById(String chapterId) {
        ValidationUtils.checkNullId(chapterId);
        return chapterRepository.findById(chapterId)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));
    }

    /**
     * Validate và lấy danh sách categories
     */
    public List<Category> validateAndGetCategories(List<String> categoryIds) {
        List<Category> categories = categoryRepository.findAllById(categoryIds);
        if (categories.size() != categoryIds.size()) {
            throw new BaseException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return categories;
    }

    /**
     * Validate slug uniqueness
     */
    public void validateSlugUniqueness(String slug) {
        if (comicRepository.findBySlug(slug).isPresent()) {
            throw new BaseException(ErrorCode.COMIC_SLUG_EXISTS);
        }
    }

    /**
     * Validate slug uniqueness cho update (loại trừ comic hiện tại)
     */
    public void validateSlugUniquenessForUpdate(String currentComicId, String slug) {
        comicRepository.findBySlug(slug)
                .filter(comic -> !comic.getId().equals(currentComicId))
                .ifPresent(comic -> {
                    throw new BaseException(ErrorCode.COMIC_SLUG_EXISTS);
                });
    }

    /**
     * Cập nhật categories của comic
     */
    public void updateComicCategories(Comic comic, List<String> categoryIds) {
        List<Category> newCategories = validateAndGetCategories(categoryIds);

        // Clear old categories và add new ones
        comic.getCategories().clear();
        comic.addCategories(newCategories);
    }

    /**
     * Xóa tất cả categories khỏi comic (dùng cho delete)
     */
    public void removeAllCategories(Comic comic) {
        comic.removeCategories(new ArrayList<>(comic.getCategories()));
    }

    /**
     * Validate chapter number uniqueness trong comic
     */
    public void validateChapterNumberUniqueness(Comic comic, Double chapterNumber) {
        if (chapterRepository.existsByComicAndChapterNumber(comic, chapterNumber)) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
        }
    }

    /**
     * Validate chapter number uniqueness cho update (loại trừ chapter hiện tại)
     */
    public void validateChapterNumberUniquenessForUpdate(Chapter currentChapter, Double newChapterNumber) {
        if (!currentChapter.getChapterNumber().equals(newChapterNumber) &&
                chapterRepository.existsByComicAndChapterNumber(currentChapter.getComic(), newChapterNumber)) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
        }
    }

    /**
     * Xác thực quyền sở hữu comic bằng comicId
     */
    public void validateComicOwnershipByComicId(User publisher, String comicId) {
        Comic comic = this.findComicById(comicId);

        if (!comic.getPublisher().getId().equals(publisher.getId())) {
            throw new BaseException(ErrorCode.PUBLISHER_COMIC_NOT_OWNER);
        }
    }

    public ComicResponse convertComicToComicResponse(Comic comic) {
        return ComicResponse.builder()
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
                .build();
    }
}