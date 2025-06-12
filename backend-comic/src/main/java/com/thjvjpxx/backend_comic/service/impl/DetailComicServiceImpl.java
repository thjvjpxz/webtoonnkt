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
import com.thjvjpxx.backend_comic.model.PurchasedChapter;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.UserFollow;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.ComicViewsHistoryRepository;
import com.thjvjpxx.backend_comic.repository.DetailChapterRepository;
import com.thjvjpxx.backend_comic.repository.PurchasedChapterRepository;
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

    @Override
    public BaseResponse<?> getComicDetail(String slug, User user) {
        Optional<Comic> comicOpt = comicRepo.findBySlug(slug);
        if (comicOpt.isEmpty()) {
            throw new BaseException(ErrorCode.COMIC_NOT_FOUND);
        }
        Comic comic = comicOpt.get();

        List<Chapter> chapters = chapterRepo.findByComicId(comic.getId());

        // Tạo Map chứa thông tin chapter đã mua nếu user đăng nhập
        Map<String, Boolean> purchasedChaptersMap = new HashMap<>();
        if (user != null) {
            List<PurchasedChapter> purchasedChapters = purchasedChapterRepo.findByUserAndComic(user, comic);
            purchasedChaptersMap = purchasedChapters.stream()
                    .collect(Collectors.toMap(
                            pc -> pc.getChapter().getId(),
                            pc -> true));
        }
        final Map<String, Boolean> finalPurchasedChaptersMap = purchasedChaptersMap;

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
    public BaseResponse<?> getChapterDetail(String chapterId, String currentUserId) {
        Chapter chapter = chapterRepo.findById(chapterId)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));

        // Kiểm tra quyền truy cập chapter có phí
        if (!chapter.isFree() && currentUserId != null) {
            // User đã đăng nhập, kiểm tra đã mua chapter chưa
            User currentUser = userRepo.findById(currentUserId)
                    .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

            boolean hasPurchased = purchasedChapterRepo.existsByUserAndChapter(currentUser, chapter);
            if (!hasPurchased && !currentUser.getVip()) {
                throw new BaseException(ErrorCode.CHAPTER_NOT_PURCHASED);
            }
        } else if (!chapter.isFree() && currentUserId == null) {
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

    private void incrementViewsCount(Comic comic) {
        comic.setViewsCount(comic.getViewsCount() + 1);
        comicRepo.save(comic);
    }

    private void incrementComicViewsHistory(Comic comic) {
        LocalDateTime date = LocalDate.now().atStartOfDay();
        Optional<ComicViewsHistory> comicViewsHistoryOpt = comicViewsHistoryRepo
                .findByComicIdAndViewDate(comic.getId(), date);
        if (comicViewsHistoryOpt.isPresent()) {
            ComicViewsHistory comicViewsHistory = comicViewsHistoryOpt.get();
            comicViewsHistory.setViewCount(comicViewsHistory.getViewCount() + 1);
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
