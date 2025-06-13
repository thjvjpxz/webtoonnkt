package com.thjvjpxx.backend_comic.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.dto.response.ComicResponse;
import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.PublisherService;
import com.thjvjpxx.backend_comic.utils.ChapterUtils;
import com.thjvjpxx.backend_comic.utils.ComicUtils;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PublisherServiceImpl implements PublisherService {

    ComicRepository comicRepository;
    ChapterRepository chapterRepository;

    // Utility classes
    ComicUtils comicUtils;
    ChapterUtils chapterUtils;

    // ==================== COMIC ====================

    @Override
    public BaseResponse<?> getMyComics(User currentUser, String search, String status,
            String category, int page, int limit) {

        Pageable pageable = PaginationUtils.createPageable(page, limit);
        int originalPage = page;
        Page<Comic> comics = null;

        // Áp dụng logic giống getAllComics nhưng với điều kiện thêm publisher
        if (search != null && !search.isEmpty()) {
            comics = comicRepository.findByPublisherAndSearchTerm(currentUser, search, pageable);
        } else if (status != null && !status.isEmpty()) {
            ComicStatus comicStatus = ComicStatus.valueOf(status.toUpperCase());
            comics = comicRepository.findByPublisherAndStatus(currentUser, comicStatus, pageable);
        } else if (category != null && !category.isEmpty()) {
            comics = comicRepository.findByPublisherAndCategory(currentUser, category, pageable);
        } else {
            comics = comicRepository.findByPublisher(currentUser, pageable);
        }

        List<ComicResponse> responses = comics.getContent().stream()
                .map(comicUtils::convertComicToComicResponse)
                .collect(Collectors.toList());

        return BaseResponse.success(
                responses,
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    // ==================== CHAPTER ====================

    @Override
    public BaseResponse<?> getAllChapters(User currentUser, int page, int limit, String search,
            String comicId) {

        Pageable pageable = PaginationUtils.createPageableWithSort(page, limit, "updatedAt",
                Sort.Direction.DESC);
        int originalPage = page;
        Page<Chapter> chapters = null;

        if (search != null && !search.isEmpty() && comicId != null && !comicId.isEmpty()) {
            comicUtils.validateComicOwnershipByComicId(currentUser, comicId);
            chapters = chapterRepository.findByTitleContainingAndComicId(search, comicId, pageable);
        } else if (search != null && !search.isEmpty()) {
            // Lấy tất cả comic của publisher hiện tại
            Page<Comic> publisherComics = comicRepository.findByPublisher(currentUser, Pageable.unpaged());
            List<String> comicIds = publisherComics.getContent().stream()
                    .map(Comic::getId)
                    .collect(Collectors.toList());

            if (comicIds.isEmpty()) {
                chapters = Page.empty(pageable);
            } else {
                // Tìm kiếm chapters với điều kiện search và thuộc về comics của publisher
                Page<Chapter> allChapters = chapterRepository.findByTitleContaining(search, pageable);
                List<Chapter> filteredChapters = allChapters.getContent().stream()
                        .filter(chapter -> comicIds.contains(chapter.getComic().getId()))
                        .collect(Collectors.toList());
                chapters = new org.springframework.data.domain.PageImpl<>(filteredChapters, pageable,
                        filteredChapters.size());
            }
        } else if (comicId != null && !comicId.isEmpty()) {
            comicUtils.validateComicOwnershipByComicId(currentUser, comicId);
            chapters = chapterRepository.findByComicId(comicId, pageable);
        } else {
            // Lấy tất cả chapters của publisher
            Page<Comic> publisherComics = comicRepository.findByPublisher(currentUser, Pageable.unpaged());
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

        // Chuyển đổi sang ChapterResponse giống như ChapterServiceImpl
        List<ChapterResponse> chapterResponses = new ArrayList<>();
        for (Chapter chapter : chapterList) {
            List<ChapterResponse.DetailChapterResponse> detailChapterResponses = chapter.getDetailChapters().stream()
                    .map(detailChapter -> ChapterResponse.DetailChapterResponse.builder()
                            .id(detailChapter.getId())
                            .imgUrl(detailChapter.getImgUrl())
                            .orderNumber(detailChapter.getOrderNumber())
                            .build())
                    .collect(Collectors.toList());

            String publisherName = chapter.getComic().getPublisher() != null
                    ? chapter.getComic().getPublisher().getUsername()
                    : null;
            Level publisherLevel = chapter.getComic().getPublisher() != null
                    ? chapter.getComic().getPublisher().getLevel()
                    : null;

            ChapterResponse chapterResponse = chapterUtils.convertChapterToChapterResponse(chapter,
                    detailChapterResponses, publisherName, publisherLevel);

            chapterResponses.add(chapterResponse);
        }

        return BaseResponse.success(
                chapterResponses,
                originalPage,
                (int) chapters.getTotalElements(),
                limit,
                chapters.getTotalPages());
    }
}