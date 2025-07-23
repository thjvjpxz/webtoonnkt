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
     * Tìm kiếm Comic theo ID với validation
     * 
     * @param comicId ID của comic cần tìm kiếm
     * @return Comic object nếu tìm thấy
     * @throws BaseException với ErrorCode.COMIC_NOT_FOUND nếu không tìm thấy comic
     * @throws BaseException nếu comicId null hoặc rỗng
     */
    public Comic findComicById(String comicId) {
        ValidationUtils.checkNullId(comicId);
        return comicRepository.findById(comicId)
                .orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));
    }

    /**
     * Tìm kiếm Chapter theo ID với validation
     * 
     * @param chapterId ID của chapter cần tìm kiếm
     * @return Chapter object nếu tìm thấy
     * @throws BaseException với ErrorCode.CHAPTER_NOT_FOUND nếu không tìm thấy chapter
     * @throws BaseException nếu chapterId null hoặc rỗng
     */
    public Chapter findChapterById(String chapterId) {
        ValidationUtils.checkNullId(chapterId);
        return chapterRepository.findById(chapterId)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));
    }

    /**
     * Validate và lấy danh sách categories theo IDs
     * 
     * @param categoryIds danh sách ID của các category cần lấy
     * @return danh sách Category objects
     * @throws BaseException với ErrorCode.CATEGORY_NOT_FOUND nếu một hoặc nhiều category không tồn tại
     */
    public List<Category> validateAndGetCategories(List<String> categoryIds) {
        List<Category> categories = categoryRepository.findAllById(categoryIds);
        if (categories.size() != categoryIds.size()) {
            throw new BaseException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return categories;
    }

    /**
     * Kiểm tra tính duy nhất của slug khi tạo mới comic
     * 
     * @param slug slug cần kiểm tra
     * @throws BaseException với ErrorCode.COMIC_SLUG_EXISTS nếu slug đã tồn tại
     */
    public void validateSlugUniqueness(String slug) {
        if (comicRepository.findBySlug(slug).isPresent()) {
            throw new BaseException(ErrorCode.COMIC_SLUG_EXISTS);
        }
    }

    /**
     * Kiểm tra tính duy nhất của slug khi cập nhật comic (loại trừ comic hiện tại)
     * 
     * @param currentComicId ID của comic hiện tại đang được cập nhật
     * @param slug slug mới cần kiểm tra
     * @throws BaseException với ErrorCode.COMIC_SLUG_EXISTS nếu slug đã được sử dụng bởi comic khác
     */
    public void validateSlugUniquenessForUpdate(String currentComicId, String slug) {
        comicRepository.findBySlug(slug)
                .filter(comic -> !comic.getId().equals(currentComicId))
                .ifPresent(comic -> {
                    throw new BaseException(ErrorCode.COMIC_SLUG_EXISTS);
                });
    }

    /**
     * Cập nhật danh sách categories của comic
     * Xóa tất cả categories cũ và thêm categories mới
     * 
     * @param comic comic cần cập nhật categories
     * @param categoryIds danh sách ID của categories mới
     * @throws BaseException với ErrorCode.CATEGORY_NOT_FOUND nếu một hoặc nhiều category không tồn tại
     */
    public void updateComicCategories(Comic comic, List<String> categoryIds) {
        List<Category> newCategories = validateAndGetCategories(categoryIds);

        // Clear old categories và add new ones
        comic.getCategories().clear();
        comic.addCategories(newCategories);
    }

    /**
     * Xóa tất cả categories khỏi comic
     * Thường được sử dụng khi xóa comic
     * 
     * @param comic comic cần xóa categories
     */
    public void removeAllCategories(Comic comic) {
        comic.removeCategories(new ArrayList<>(comic.getCategories()));
    }

    /**
     * Kiểm tra tính duy nhất của chapter number trong một comic khi tạo mới
     * 
     * @param comic comic chứa chapter
     * @param chapterNumber số thứ tự chapter cần kiểm tra
     * @throws BaseException với ErrorCode.CHAPTER_NUMBER_EXISTS nếu chapter number đã tồn tại trong comic
     */
    public void validateChapterNumberUniqueness(Comic comic, Double chapterNumber) {
        if (chapterRepository.existsByComicAndChapterNumber(comic, chapterNumber)) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
        }
    }

    /**
     * Kiểm tra tính duy nhất của chapter number khi cập nhật chapter (loại trừ chapter hiện tại)
     * 
     * @param currentChapter chapter hiện tại đang được cập nhật
     * @param newChapterNumber số thứ tự chapter mới cần kiểm tra
     * @throws BaseException với ErrorCode.CHAPTER_NUMBER_EXISTS nếu chapter number mới đã được sử dụng bởi chapter khác trong cùng comic
     */
    public void validateChapterNumberUniquenessForUpdate(Chapter currentChapter, Double newChapterNumber) {
        if (!currentChapter.getChapterNumber().equals(newChapterNumber) &&
                chapterRepository.existsByComicAndChapterNumber(currentChapter.getComic(), newChapterNumber)) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
        }
    }

    /**
     * Xác thực quyền sở hữu comic của publisher
     * Kiểm tra xem publisher có phải là chủ sở hữu của comic hay không
     * 
     * @param publisher publisher cần kiểm tra quyền sở hữu
     * @param comicId ID của comic cần kiểm tra
     * @throws BaseException với ErrorCode.COMIC_NOT_FOUND nếu comic không tồn tại
     * @throws BaseException với ErrorCode.PUBLISHER_COMIC_NOT_OWNER nếu publisher không phải chủ sở hữu comic
     */
    public void validateComicOwnershipByComicId(User publisher, String comicId) {
        Comic comic = this.findComicById(comicId);

        if (!comic.getPublisher().getId().equals(publisher.getId())) {
            throw new BaseException(ErrorCode.PUBLISHER_COMIC_NOT_OWNER);
        }
    }

    /**
     * Chuyển đổi Comic entity thành ComicResponse DTO
     * 
     * @param comic Comic entity cần chuyển đổi
     * @return ComicResponse DTO chứa thông tin comic để trả về client
     */
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