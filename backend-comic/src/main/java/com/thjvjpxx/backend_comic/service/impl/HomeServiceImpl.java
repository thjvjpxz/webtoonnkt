package com.thjvjpxx.backend_comic.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.dto.request.ChangePassRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse.ChapterHome;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse.ComicHistory;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse.ComicLastUpdate;
import com.thjvjpxx.backend_comic.dto.response.HomeResponse.PopulerToday;
import com.thjvjpxx.backend_comic.dto.response.UserProfileResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.LevelType;
import com.thjvjpxx.backend_comic.model.ReadingHistory;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.UserFollow;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.LevelRepository;
import com.thjvjpxx.backend_comic.repository.LevelTypeRepository;
import com.thjvjpxx.backend_comic.repository.ReadingHistoryRepository;
import com.thjvjpxx.backend_comic.repository.UserFollowRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
import com.thjvjpxx.backend_comic.service.HomeService;
import com.thjvjpxx.backend_comic.service.StorageService;
import com.thjvjpxx.backend_comic.utils.FileUtils;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.StringUtils;

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
    StorageService storageService;
    ReadingHistoryRepository readingHistoryRepo;

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
    public BaseResponse<?> getFavorites(User user, int page, int size) {
        Pageable pageable = PaginationUtils.createPageable(page, size);
        Page<UserFollow> favorites = userFollowRepo.findByUserId(user.getId(), pageable);

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
    public BaseResponse<?> getProfile(User user) {
        Level nextLevel = levelRepo.findByLevelNumberAndLevelType(user.getLevel().getLevelNumber() + 1,
                user.getLevel().getLevelType()).get();
        UserProfileResponse userProfileResponse = UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .imgUrl(user.getImgUrl())
                .vip(user.getVip())
                .active(user.getActive())
                .blocked(user.getBlocked())
                .deleted(user.getDeleted())
                .role(user.getRole())
                .balance(user.getBalance())
                .level(user.getLevel())
                .currentExp(user.getCurrentExp())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .nextLevelExpRequired(nextLevel != null ? nextLevel.getExpRequired() : null)
                .build();
        return BaseResponse.success(userProfileResponse);
    }

    @Override
    public BaseResponse<?> changePassword(User user, ChangePassRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BaseException(ErrorCode.PASSWORD_AND_CONFIRM_NOT_MATCH);
        }
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BaseException(ErrorCode.INVALID_OLD_PASSWORD);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);
        return BaseResponse.success("Đổi mật khẩu thành công");
    }

    @Override
    public BaseResponse<?> updateProfile(User user, String levelTypeId) {
        LevelType levelType = levelTypeRepo.findById(levelTypeId)
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_TYPE_NOT_FOUND));
        Level level = user.getLevel();
        int levelNumber = level.getLevelNumber();

        Level newLevel = levelRepo.findByLevelNumberAndLevelType(levelNumber, levelType)
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_NOT_FOUND));

        user.setLevel(newLevel);
        userRepo.save(user);
        return BaseResponse.success("Cập nhật thông tin thành công");
    }

    @Override
    public BaseResponse<?> changeAvatar(User user, MultipartFile file) {
        // Kiểm tra file có tồn tại không
        if (file == null || file.isEmpty()) {
            throw new BaseException(ErrorCode.FILE_NOT_FOUND);
        }

        // Lưu URL avatar cũ để xóa sau khi upload thành công
        String oldImgUrl = user.getImgUrl();

        // Xóa avatar cũ nếu có
        if (oldImgUrl != null && !oldImgUrl.isEmpty()) {
            FileUtils.deleteFileFromB2(oldImgUrl, storageService);
        }

        // Upload avatar mới
        String fileName = user.getUsername() + "." + StringUtils.getExtension(file.getOriginalFilename());
        var response = storageService.uploadFile(file, B2Constants.FOLDER_KEY_AVATAR, fileName);

        if (response.getStatus() != HttpStatus.OK.value()) {
            throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
        }

        // Cập nhật URL avatar mới cho user
        String newImgUrl = response.getMessage();
        user.setImgUrl(newImgUrl);
        userRepo.save(user);

        return BaseResponse.success("Thay đổi avatar thành công");
    }

    @Override
    public BaseResponse<List<ComicHistory>> getHistory(User user, int page, int size) {
        Pageable pageable = PaginationUtils.createPageable(page, size);

        int originalPage = page;

        // Lấy danh sách comic distinct từ lịch sử đọc của user với phân trang
        Page<ReadingHistory> historyPage = readingHistoryRepo.findDistinctComicsByUserId(user.getId(), pageable);

        List<ComicHistory> historyComics = new ArrayList<>();

        for (ReadingHistory history : historyPage.getContent()) {
            Comic comic = history.getChapter().getComic();
            Double latestChapter = chapterRepo.findMaxChapterNumberByComicId(comic.getId());
            Double alreadyRead = readingHistoryRepo.findMaxChapterNumberReadByUserAndComic(user.getId(), comic.getId());

            ComicHistory comicHistory = ComicHistory.builder()
                    .id(comic.getId())
                    .thumbUrl(comic.getThumbUrl())
                    .slug(comic.getSlug())
                    .name(comic.getName())
                    .viewCount((long) comic.getViewsCount())
                    .latestChapter(latestChapter)
                    .alreadyRead(alreadyRead)
                    .build();

            historyComics.add(comicHistory);
        }

        return BaseResponse.success(
                historyComics,
                originalPage,
                (int) historyPage.getTotalElements(),
                size,
                historyPage.getTotalPages());
    }

    // ======================= HELPER METHODS =======================

    /**
     * Lấy danh sách category phổ biến
     * 
     * @return Danh sách category phổ biến
     */
    private List<Category> getPopulerCategories() {
        return categoryRepo.findTop10CategoriesWithMostComics();
    }

    /**
     * Lấy danh sách comic phổ biến hôm nay
     * 
     * @return Danh sách comic phổ biến hôm nay
     */
    private List<PopulerToday> getTopDayComics() {
        LocalDate startDate = LocalDate.now();
        return comicRepo.findTopComicsByStartAndEndDate(startDate, startDate);
    }

    /**
     * Lấy danh sách comic phổ biến trong tuần
     * 
     * @return Danh sách comic phổ biến trong tuần
     */
    private List<PopulerToday> getTopWeekComics() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        return comicRepo.findTopComicsByStartAndEndDate(startDate, endDate);
    }

    /**
     * Lấy danh sách comic phổ biến trong tháng
     * 
     * @return Danh sách comic phổ biến trong tháng
     */
    private List<PopulerToday> getTopMonthComics() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        return comicRepo.findTopComicsByStartAndEndDate(startDate, endDate);
    }

    /**
     * Lấy danh sách comic phổ biến trong tất cả thời gian
     * 
     * @return Danh sách comic phổ biến trong tất cả thời gian
     */
    private List<PopulerToday> getTopAllComics() {
        return comicRepo.findTopComicsAll();
    }

    /**
     * Lấy danh sách comic có chương mới nhất
     * 
     * @return Danh sách comic có chương mới nhất
     */
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
