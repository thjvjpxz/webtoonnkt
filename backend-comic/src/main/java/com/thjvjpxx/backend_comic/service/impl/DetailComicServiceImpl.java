package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.DetailComicResponse;
import com.thjvjpxx.backend_comic.dto.response.DetailComicResponse.ChapterSummary;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.DetailComicService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DetailComicServiceImpl implements DetailComicService {

    ComicRepository comicRepo;
    ChapterRepository chapterRepo;

    @Override
    public BaseResponse<?> getComicDetail(String slug) {
        Optional<Comic> comicOpt = comicRepo.findBySlug(slug);
        if (comicOpt.isEmpty()) {
            throw new BaseException(ErrorCode.COMIC_NOT_FOUND);
        }
        Comic comic = comicOpt.get();

        List<Chapter> chapters = chapterRepo.findByComicId(comic.getId());

        List<ChapterSummary> chapterSummaries = chapters.stream()
                .map(chapter -> ChapterSummary.builder()
                        .id(chapter.getId())
                        .title(chapter.getTitle())
                        .domainCdn(chapter.getDomainCdn())
                        .chapterPath(chapter.getChapterPath())
                        .chapterNumber(chapter.getChapterNumber())
                        .price(chapter.getPrice())
                        .status(chapter.getStatus().name())
                        .createdAt(chapter.getCreatedAt().toString())
                        .updatedAt(chapter.getUpdatedAt().toString())
                        .build())
                .collect(Collectors.toList());

        DetailComicResponse response = DetailComicResponse.builder()
                .id(comic.getId())
                .name(comic.getName())
                .slug(comic.getSlug())
                .originName(comic.getOriginName())
                .thumbUrl(comic.getThumbUrl())
                .author(comic.getAuthor())
                .status(comic.getStatus().name())
                .followersCount(comic.getFollowersCount())
                .viewsCount(comic.getViewsCount())
                .description(comic.getDescription())
                .lastChapterId(comic.getLastChapterId())
                .categories(comic.getCategories().stream().collect(Collectors.toList()))
                .chapters(chapterSummaries)
                .build();

        return BaseResponse.success(response);
    }

}
