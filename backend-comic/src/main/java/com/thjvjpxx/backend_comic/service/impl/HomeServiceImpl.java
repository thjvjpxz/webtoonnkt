package com.thjvjpxx.backend_comic.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse.ChapterHome;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse.ComicLastUpdate;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse.PopulerToday;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.HomeService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HomeServiceImpl implements HomeService {

    CategoryRepository categoryRepo;
    ComicRepository comicRepo;
    ChapterRepository chapterRepo;

    @Override
    public BaseResponse<?> getHomeComic() {
        List<Category> populerCategories = getPopulerCategories();
        List<PopulerToday> populerToday = getTopDayComics();
        List<PopulerToday> populerWeek = getTopWeekComics();
        List<PopulerToday> populerMonth = getTopMonthComics();
        List<PopulerToday> populerAll = getTopAllComics();
        List<ComicLastUpdate> comicLastUpdates = getLastUpdateComics();

        HomeResponse homeResponse = HomeResponse.builder()
                .populerCategories(populerCategories)
                .populerToday(populerToday)
                .populerWeek(populerWeek)
                .populerMonth(populerMonth)
                .populerAll(populerAll)
                .comicLastUpdate(comicLastUpdates)
                .build();

        return BaseResponse.success(homeResponse);
    }

    @Override
    public BaseResponse<?> getAllCategory() {
        List<Category> categories = categoryRepo.findAll();
        return BaseResponse.success(categories);
    }

    @Override
    public BaseResponse<?> getComicByCategory(String slug, int page, int size) {
        Pageable pageable = PaginationUtils.createPageable(page, size);
        Page<Comic> comics = comicRepo.findBySlugCategory(slug, pageable);

        List<PopulerToday> populerToday = new ArrayList<>();

        for (Comic comic : comics.getContent()) {
            Double latestChapter = chapterRepo.findMaxChapterNumberByComicId(comic.getId());
            populerToday.add(PopulerToday.builder()
                    .id(comic.getId())
                    .thumbUrl(comic.getThumbUrl())
                    .slug(comic.getSlug())
                    .name(comic.getName())
                    .viewCount((long) comic.getViewsCount())
                    .latestChapter(latestChapter)
                    .build());
        }

        return BaseResponse.success(populerToday);
    }

    @Override
    public BaseResponse<?> searchComic(String query, int page, int size) {
        Pageable pageable = PaginationUtils.createPageable(page, size);
        Page<Comic> comics = comicRepo.findBySlugContainingOrNameContaining(query, query, pageable);

        return BaseResponse.success(comics.getContent());
    }

    private List<Category> getPopulerCategories() {
        return categoryRepo.findTop10CategoriesWithMostComics();
    }

    private List<PopulerToday> getTopDayComics() {
        LocalDate startDate = LocalDate.now();
        return comicRepo.findTopComicsByStartAndEndDate(startDate, startDate);
    }

    private List<PopulerToday> getTopWeekComics() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        return comicRepo.findTopComicsByStartAndEndDate(startDate, endDate);
    }

    private List<PopulerToday> getTopMonthComics() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        return comicRepo.findTopComicsByStartAndEndDate(startDate, endDate);
    }

    private List<PopulerToday> getTopAllComics() {
        return comicRepo.findTopComicsAll();
    }

    private List<ComicLastUpdate> getLastUpdateComics() {
        List<PopulerToday> populerTodays = comicRepo.findLastUpdateComics();
        List<ComicLastUpdate> comicLastUpdates = new ArrayList<>();
        for (PopulerToday populerToday : populerTodays) {
            // get chapter
            List<ChapterHome> chapters = chapterRepo.findTop4LatestChapter(populerToday.getId());
            ComicLastUpdate comicLastUpdate = ComicLastUpdate.builder()
                    .id(populerToday.getId())
                    .slug(populerToday.getSlug())
                    .name(populerToday.getName())
                    .thumbUrl(populerToday.getThumbUrl())
                    .viewCount(populerToday.getViewCount())
                    .chapters(chapters)
                    .build();
            comicLastUpdates.add(comicLastUpdate);
        }
        return comicLastUpdates;
    }

}
