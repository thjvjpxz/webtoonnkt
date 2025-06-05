package com.thjvjpxx.backend_comic.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.request.ChangePassRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse.ChapterHome;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse.ComicLastUpdate;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse.PopulerToday;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.LevelType;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.UserFollow;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.LevelRepository;
import com.thjvjpxx.backend_comic.repository.LevelTypeRepository;
import com.thjvjpxx.backend_comic.repository.UserFollowRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
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
    UserFollowRepository userFollowRepo;
    UserRepository userRepo;
    PasswordEncoder passwordEncoder;
    LevelRepository levelRepo;
    LevelTypeRepository levelTypeRepo;

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

    @Override
    public BaseResponse<?> getFavorites(String currentUserId, int page, int size) {
        Pageable pageable = PaginationUtils.createPageable(page, size);
        Page<UserFollow> favorites = userFollowRepo.findByUserId(currentUserId, pageable);

        List<PopulerToday> populerToday = new ArrayList<>();

        for (UserFollow favorite : favorites.getContent()) {
            Comic comic = favorite.getComic();
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
    public BaseResponse<?> getProfile(String currentUserId) {
        User user = userRepo.findById(currentUserId).orElseThrow(() -> new RuntimeException("User not found"));
        return BaseResponse.success(user);
    }

    @Override
    public BaseResponse<?> changePassword(String currentUserId, ChangePassRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BaseException(ErrorCode.PASSWORD_AND_CONFIRM_NOT_MATCH);
        }
        User user = userRepo.findById(currentUserId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BaseException(ErrorCode.INVALID_OLD_PASSWORD);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);
        return BaseResponse.success("Đổi mật khẩu thành công");
    }

    @Override
    public BaseResponse<?> updateProfile(String currentUserId, String levelTypeId) {
        User user = userRepo.findById(currentUserId).orElseThrow(() -> new RuntimeException("User not found"));
        LevelType levelType = levelTypeRepo.findById(levelTypeId)
                .orElseThrow(() -> new RuntimeException("Level type not found"));
        Level level = user.getLevel();
        int levelNumber = level.getLevelNumber();

        Level newLevel = levelRepo.findByLevelNumberAndLevelType(levelNumber, levelType)
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_NOT_FOUND));

        user.setLevel(newLevel);
        userRepo.save(user);
        return BaseResponse.success("Cập nhật thông tin thành công");
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
