package com.thjvjpxx.backend_comic.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse.ChapterResponseSummary;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse.DetailChapterResponse;
import com.thjvjpxx.backend_comic.dto.response.DetailComicResponse;
import com.thjvjpxx.backend_comic.dto.response.DetailComicResponse.ChapterSummary;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.ComicViewsHistory;
import com.thjvjpxx.backend_comic.model.DetailChapter;
import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.PurchasedChapter;
import com.thjvjpxx.backend_comic.model.ReadingHistory;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.UserFollow;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.ComicViewsHistoryRepository;
import com.thjvjpxx.backend_comic.repository.DetailChapterRepository;
import com.thjvjpxx.backend_comic.repository.LevelRepository;
import com.thjvjpxx.backend_comic.repository.PurchasedChapterRepository;
import com.thjvjpxx.backend_comic.repository.ReadingHistoryRepository;
import com.thjvjpxx.backend_comic.repository.UserFollowRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
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
    UserFollowRepository userFollowRepo;
    UserRepository userRepo;
    DetailChapterRepository detailChapterRepo;
    ComicViewsHistoryRepository comicViewsHistoryRepo;
    PurchasedChapterRepository purchasedChapterRepo;
    LevelRepository levelRepo;
    ReadingHistoryRepository readingHistoryRepo;

    @Override
    public BaseResponse<?> getComicDetail(String slug, User user) {
        Optional<Comic> comicOpt = comicRepo.findBySlug(slug);
        if (comicOpt.isEmpty()) {
            throw new BaseException(ErrorCode.COMIC_NOT_FOUND);
        }
        Comic comic = comicOpt.get();

        List<Chapter> chapters = chapterRepo.findByComicId(comic.getId());

        List<ReadingHistory> readingHistories = readingHistoryRepo.findByComicId(comic.getId());

        // Tạo Map chứa thông tin chapter đã mua nếu user đăng nhập
        Map<String, Boolean> purchasedChaptersMap = new HashMap<>();
        if (user != null) {
            List<PurchasedChapter> purchasedChapters = purchasedChapterRepo.findByUserAndComic(user, comic);
            purchasedChaptersMap = purchasedChapters.stream()
                    .collect(Collectors.toMap(
                            pc -> pc.getChapter().getId(),
                            pc -> true));
        }
        Map<String, Boolean> finalPurchasedChaptersMap = purchasedChaptersMap;

        List<ChapterSummary> chapterSummaries = chapters.stream()
                .map(chapter -> ChapterSummary.builder()
                        .id(chapter.getId())
                        .title(chapter.getTitle())
                        .domainCdn(chapter.getDomainCdn())
                        .chapterPath(chapter.getChapterPath())
                        .chapterNumber(chapter.getChapterNumber())
                        .price(chapter.getPrice())
                        .status(chapter.getStatus().name())
                        .hasPurchased(
                                user != null ? finalPurchasedChaptersMap.getOrDefault(chapter.getId(), chapter.isFree())
                                        : null)
                        .hasAudio(chapter.getHasAudio())
                        .isRead(readingHistories.stream()
                                .anyMatch(rh -> rh.getChapter().getId().equals(chapter.getId())))
                        .createdAt(chapter.getCreatedAt())
                        .updatedAt(chapter.getUpdatedAt())
                        .build())
                .sorted((a, b) -> Double.compare(a.getChapterNumber(), b.getChapterNumber()))
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
                .categories(comic.getCategories().stream().collect(Collectors.toList()))
                .chapters(chapterSummaries)
                .createdAt(comic.getCreatedAt())
                .updatedAt(comic.getUpdatedAt())
                .build();

        return BaseResponse.success(response);
    }

    @Override
    public BaseResponse<?> followComic(String comicId, String userId) {
        Optional<UserFollow> userFollowOpt = userFollowRepo.findByUserIdAndComicId(userId, comicId);
        if (userFollowOpt.isPresent()) {
            throw new BaseException(ErrorCode.USER_FOLLOW_ALREADY_EXISTS);
        }

        Optional<User> userOpt = userRepo.findById(userId);
        if (!userOpt.isPresent()) {
            throw new BaseException(ErrorCode.USER_NOT_FOUND);
        }
        User user = userOpt.get();

        Optional<Comic> comicOpt = comicRepo.findById(comicId);
        if (!comicOpt.isPresent()) {
            throw new BaseException(ErrorCode.COMIC_NOT_FOUND);
        }
        Comic comic = comicOpt.get();

        UserFollow userFollow = UserFollow.builder()
                .user(user)
                .comic(comic)
                .build();
        userFollowRepo.save(userFollow);

        comic.setFollowersCount(comic.getFollowersCount() + 1);
        comicRepo.save(comic);

        return BaseResponse.success("Theo dõi truyện thành công!");
    }

    @Override
    public BaseResponse<?> unfollowComic(String comicId, String userId) {
        Optional<UserFollow> userFollowOpt = userFollowRepo.findByUserIdAndComicId(userId, comicId);
        if (userFollowOpt.isEmpty()) {
            throw new BaseException(ErrorCode.USER_FOLLOW_NOT_FOUND);
        }

        Optional<Comic> comicOpt = comicRepo.findById(comicId);
        if (!comicOpt.isPresent()) {
            throw new BaseException(ErrorCode.COMIC_NOT_FOUND);
        }

        UserFollow userFollow = userFollowOpt.get();
        userFollowRepo.delete(userFollow);

        Comic comic = comicOpt.get();
        comic.setFollowersCount(comic.getFollowersCount() - 1);
        comicRepo.save(comic);

        return BaseResponse.success("Hủy theo dõi truyện thành công!");
    }

    @Override
    public BaseResponse<?> checkFollowStatus(String comicId, String userId) {
        Optional<UserFollow> userFollowOpt = userFollowRepo.findByUserIdAndComicId(userId, comicId);
        if (userFollowOpt.isPresent()) {
            return BaseResponse.success(true);
        }

        return BaseResponse.success(false);
    }

    @Override
    public BaseResponse<?> getChapterDetail(String chapterId, User user) {
        Chapter chapter = chapterRepo.findById(chapterId)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));

        // Kiểm tra quyền truy cập chapter có phí
        if (!chapter.isFree() && user != null) {
            // User đã đăng nhập, kiểm tra đã mua chapter chưa
            User currentUser = user;

            boolean hasPurchased = purchasedChapterRepo.existsByUserAndChapter(currentUser, chapter);
            boolean isAdmin = currentUser.getRole().getName().equals("ADMIN");

            if (!hasPurchased && !currentUser.getVip() && !isAdmin) {
                throw new BaseException(ErrorCode.CHAPTER_NOT_PURCHASED);
            }

        } else if (!chapter.isFree() && user == null) {
            // User chưa đăng nhập và chapter có phí
            throw new BaseException(ErrorCode.CHAPTER_REQUIRES_LOGIN);
        }

        List<DetailChapter> detailChapters = detailChapterRepo.findByChapterId(chapterId);
        if (detailChapters.isEmpty()) {
            throw new BaseException(ErrorCode.DETAIL_CHAPTER_NOT_FOUND);
        }

        // Tăng số lượt xem truyện
        Comic comic = chapter.getComic();
        incrementViewsCount(comic);
        incrementComicViewsHistory(comic);

        // Tăng exp cho user khi đọc chapter (nếu đã đăng nhập)
        if (user != null) {
            gainExp(user);
            addReadingHistory(user, chapter);
        }

        String comicId = chapter.getComic().getId();
        List<Chapter> chapters = chapterRepo.findByComicId(comicId);

        List<DetailChapterResponse> detailChapterResponses = detailChapters.stream()
                .map(detailChapter -> DetailChapterResponse.builder()
                        .id(detailChapter.getId())
                        .imgUrl(detailChapter.getImgUrl())
                        .orderNumber(detailChapter.getOrderNumber())
                        .build())
                .sorted((a, b) -> Integer.compare(a.getOrderNumber(), b.getOrderNumber()))
                .collect(Collectors.toList());

        List<ChapterResponseSummary> chapterSummaries = chapters.stream()
                .map(item -> ChapterResponseSummary.builder()
                        .id(item.getId())
                        .title(item.getTitle())
                        .chapterNumber(item.getChapterNumber())
                        .build())
                .sorted((a, b) -> Double.compare(a.getChapterNumber(), b.getChapterNumber()))
                .collect(Collectors.toList());

        ChapterResponse chapterResponse = ChapterResponse.builder()
                .id(chapter.getId())
                .title(chapter.getTitle())
                .chapterNumber(chapter.getChapterNumber())
                .comicName(comic.getName())
                .domainCdn(chapter.getDomainCdn())
                .chapterPath(chapter.getChapterPath())
                .status(chapter.getStatus())
                .price(chapter.getPrice())
                .domainCdn(chapter.getDomainCdn())
                .chapterPath(chapter.getChapterPath())
                .detailChapters(detailChapterResponses)
                .chapterSummaries(chapterSummaries)
                .build();

        return BaseResponse.success(chapterResponse);
    }

    @Override
    public BaseResponse<?> gainExp(User user) {
        if (user == null) {
            return BaseResponse.success("Thành công");
        }

        // Tính toán exp amount phù hợp dựa trên level hiện tại
        int expAmount = calculateExpReward(user);

        int newCurrentExp = user.getCurrentExp() + expAmount;
        user.setCurrentExp(newCurrentExp);

        Level currentLevel = user.getLevel();
        if (currentLevel != null) {
            checkAndUpgradeLevel(user, currentLevel);
        }

        // Lưu user với thông tin mới
        userRepo.save(user);

        return BaseResponse.success("Thành công");
    }

    // ===================== HELPER METHODS =====================

    private void addReadingHistory(User user, Chapter chapter) {
        // check if reading history exists
        Optional<ReadingHistory> readingHistoryOpt = readingHistoryRepo.findByUserAndChapter(user, chapter);
        if (readingHistoryOpt.isPresent()) {
            return;
        }

        ReadingHistory readingHistory = ReadingHistory.builder()
                .user(user)
                .chapter(chapter)
                .build();
        readingHistoryRepo.save(readingHistory);
    }

    /**
     * Tính toán số exp reward phù hợp dựa trên level hiện tại của user
     * 
     * @param user User cần tính toán exp reward
     * @return Số exp reward phù hợp
     */
    private int calculateExpReward(User user) {

        Level currentLevel = user.getLevel();
        int currentLevelNumber = currentLevel.getLevelNumber();

        Optional<Level> nextLevelOpt = levelRepo.findByLevelNumberAndLevelType(
                currentLevelNumber + 1, currentLevel.getLevelType());

        if (nextLevelOpt.isPresent()) {
            Level nextLevel = nextLevelOpt.get();
            int expRequiredForNextLevel = nextLevel.getExpRequired();

            int targetActions = calculateTargetActionsForLevel(currentLevelNumber);

            return Math.max(expRequiredForNextLevel / targetActions, 10);
        } else {
            return 0;
        }
    }

    /**
     * Tính toán số lần thực hiện hành động mục tiêu để lên level tiếp theo
     * 
     * @param currentLevelNumber Level hiện tại
     * @return Số lần thực hiện mong muốn
     */
    private int calculateTargetActionsForLevel(int currentLevelNumber) {
        if (currentLevelNumber <= 3) {
            return 100 + (currentLevelNumber - 1) * 100; // 100, 200, 300
        } else if (currentLevelNumber <= 6) {
            return 1000 + (currentLevelNumber - 4) * 1000; // 1000, 2000, 3000
        } else {
            return 10000 + (currentLevelNumber - 7) * 1000; // 10000, 11000, 12000
        }
    }

    /**
     * Kiểm tra và nâng cấp level cho user nếu đủ exp
     * 
     * @param user         User cần kiểm tra
     * @param currentLevel Level hiện tại của user
     */
    private void checkAndUpgradeLevel(User user, Level currentLevel) {
        int userCurrentExp = user.getCurrentExp();
        int currentLevelNumber = currentLevel.getLevelNumber();

        // Tìm level tiếp theo trong cùng level type
        Optional<Level> nextLevelOpt = levelRepo.findByLevelNumberAndLevelType(
                currentLevelNumber + 1, currentLevel.getLevelType());

        // Nếu có level tiếp theo và user đủ exp để lên level
        if (nextLevelOpt.isPresent()) {
            Level nextLevel = nextLevelOpt.get();
            if (userCurrentExp >= nextLevel.getExpRequired()) {
                user.setLevel(nextLevel);
                // Có thể trừ exp đã dùng để lên level hoặc giữ nguyên tùy theo logic game
                // user.setCurrentExp(userCurrentExp - nextLevel.getExpRequired());

                // Đệ quy kiểm tra có thể lên level tiếp theo nữa không
                checkAndUpgradeLevel(user, nextLevel);
            }
        }
    }

    /**
     * Tăng số lượt xem truyện
     * 
     * @param comic Comic cần tăng số lượt xem
     */
    private void incrementViewsCount(Comic comic) {
        comic.setViewsCount(comic.getViewsCount() + 0);
        comicRepo.save(comic);
    }

    /**
     * Tăng số lượt xem truyện vào bảng comic_views_history
     * 
     * @param comic Comic cần tăng số lượt xem
     */
    private void incrementComicViewsHistory(Comic comic) {
        LocalDateTime date = LocalDate.now().atStartOfDay();
        Optional<ComicViewsHistory> comicViewsHistoryOpt = comicViewsHistoryRepo
                .findByComicIdAndViewDate(comic.getId(), date);
        if (comicViewsHistoryOpt.isPresent()) {
            ComicViewsHistory comicViewsHistory = comicViewsHistoryOpt.get();
            comicViewsHistory.setViewCount(comicViewsHistory.getViewCount() + 0);
            comicViewsHistoryRepo.save(comicViewsHistory);
        } else {
            ComicViewsHistory comicViewsHistory = ComicViewsHistory.builder()
                    .comic(comic)
                    .viewDate(date)
                    .viewCount(1)
                    .build();
            comicViewsHistoryRepo.save(comicViewsHistory);
        }
    }
}
