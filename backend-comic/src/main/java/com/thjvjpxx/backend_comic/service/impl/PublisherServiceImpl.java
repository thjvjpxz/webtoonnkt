package com.thjvjpxx.backend_comic.service.impl;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.constant.GlobalConstants;
import com.thjvjpxx.backend_comic.constant.GoogleDriveConstants;
import com.thjvjpxx.backend_comic.dto.request.PublisherChapterRequest;
import com.thjvjpxx.backend_comic.dto.request.PublisherComicRequest;
import com.thjvjpxx.backend_comic.dto.request.WithdrawalRequestDto;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherComicResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherStatsResponse;
import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.enums.WithdrawalStatus;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.DetailChapter;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.WithdrawalRequest;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.TransactionRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
import com.thjvjpxx.backend_comic.repository.WithdrawalRequestRepository;
import com.thjvjpxx.backend_comic.service.PublisherService;
import com.thjvjpxx.backend_comic.service.StorageFactory;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.StringUtils;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PublisherServiceImpl implements PublisherService {

    ComicRepository comicRepository;
    ChapterRepository chapterRepository;
    CategoryRepository categoryRepository;
    TransactionRepository transactionRepository;
    WithdrawalRequestRepository withdrawalRequestRepository;
    UserRepository userRepository;
    StorageFactory storageFactory;

    @Override
    @Transactional
    public BaseResponse<Comic> createComic(String currentUserId, PublisherComicRequest request,
            MultipartFile coverFile) {
        User publisher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        // Validate categories
        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        if (categories.size() != request.getCategoryIds().size()) {
            throw new BaseException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // Create slug
        String slug = generateSlug(request.getName());

        // Check if slug exists
        if (comicRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        // Handle cover upload
        String thumbUrl = request.getThumbUrl();
        if (coverFile != null && !coverFile.isEmpty()) {
            var response = storageFactory.getStorageService().uploadFile(
                    coverFile,
                    GlobalConstants.TYPE_THUMBNAIL,
                    slug + "_thumb");
            if (response.getStatus() != 200) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            thumbUrl = response.getMessage();
        }

        Comic comic = new Comic();
        comic.setName(request.getName());
        comic.setSlug(slug);
        comic.setOriginName(request.getOriginName());
        comic.setAuthor(request.getAuthor());
        comic.setDescription(request.getDescription());
        comic.setThumbUrl(thumbUrl);
        comic.setStatus(ComicStatus.ONGOING);
        comic.setPublisher(publisher);
        comic.addCategories(categories);

        Comic savedComic = comicRepository.save(comic);
        return BaseResponse.success(savedComic);
    }

    @Override
    @Transactional
    public BaseResponse<Comic> updateComic(String currentUserId, String comicId, PublisherComicRequest request,
            MultipartFile coverFile) {
        User publisher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        validateComicOwnership(publisher, comicId);
        Comic comic = findComicById(comicId);

        // Validate categories
        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        if (categories.size() != request.getCategoryIds().size()) {
            throw new BaseException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // Handle cover upload
        String thumbUrl = comic.getThumbUrl();
        if (coverFile != null && !coverFile.isEmpty()) {
            var response = storageFactory.getStorageService().uploadFile(
                    coverFile,
                    GlobalConstants.TYPE_THUMBNAIL,
                    comic.getSlug() + "_thumb");
            if (response.getStatus() != 200) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            thumbUrl = response.getMessage();
        } else if (request.getThumbUrl() != null) {
            // Nếu không upload file mới nhưng có URL từ request
            thumbUrl = request.getThumbUrl();
        }

        // Update fields
        comic.setName(request.getName());
        comic.setOriginName(request.getOriginName());
        comic.setAuthor(request.getAuthor());
        comic.setDescription(request.getDescription());
        comic.setThumbUrl(thumbUrl);

        // Update categories
        comic.getCategories().clear();
        comic.addCategories(categories);

        Comic savedComic = comicRepository.save(comic);
        return BaseResponse.success(savedComic);
    }

    @Override
    @Transactional
    public BaseResponse<Void> deleteComic(String currentUserId, String comicId) {
        User publisher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        validateComicOwnership(publisher, comicId);
        Comic comic = findComicById(comicId);

        String thumbUrl = comic.getThumbUrl();
        if (thumbUrl != null && !thumbUrl.isEmpty() && thumbUrl.startsWith(GoogleDriveConstants.URL_IMG_GOOGLE_DRIVE)) {
            storageFactory.getStorageService().remove(StringUtils.getIdFromUrl(thumbUrl));
        } else if (thumbUrl != null && !thumbUrl.isEmpty() && thumbUrl.startsWith(B2Constants.URL_PREFIX)) {
            storageFactory.getStorageService().remove(thumbUrl);
        }

        comicRepository.delete(comic);
        return BaseResponse.success("Xóa truyện thành công");
    }

    @Override
    public BaseResponse<List<PublisherComicResponse>> getMyComics(String currentUserId, String search, String status,
            String category, int page, int size) {
        User publisher = userRepository.findById(currentUserId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PaginationUtils.createPageable(page, size);
        int originalPage = page;
        Page<Comic> comics = null;

        // Áp dụng logic giống getAllComics nhưng với điều kiện thêm publisher
        if (search != null && !search.isEmpty()) {
            comics = comicRepository.findByPublisherAndSearchTerm(publisher, search, pageable);
        } else if (status != null && !status.isEmpty()) {
            ComicStatus comicStatus = ComicStatus.valueOf(status.toUpperCase());
            comics = comicRepository.findByPublisherAndStatus(publisher, comicStatus, pageable);
        } else if (category != null && !category.isEmpty()) {
            comics = comicRepository.findByPublisherAndCategory(publisher, category, pageable);
        } else {
            comics = comicRepository.findByPublisher(publisher, pageable);
        }

        List<PublisherComicResponse> responses = comics.getContent().stream()
                .map(this::convertToPublisherComicResponse)
                .collect(Collectors.toList());

        return BaseResponse.success(
                responses,
                originalPage,
                (int) comics.getTotalElements(),
                size,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<PublisherComicResponse> getMyComic(User publisher, String comicId) {
        validateComicOwnership(publisher, comicId);
        Comic comic = findComicById(comicId);

        PublisherComicResponse response = convertToPublisherComicResponse(comic);
        return BaseResponse.success(response);
    }

    @Override
    @Transactional
    public BaseResponse<Chapter> createChapter(User publisher, String comicId, PublisherChapterRequest request) {
        validateComicOwnership(publisher, comicId);
        Comic comic = findComicById(comicId);

        // Check if chapter number exists
        if (chapterRepository.existsByComicAndChapterNumber(comic, request.getChapterNumber())) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
        }

        Chapter chapter = Chapter.builder()
                .title(request.getTitle())
                .chapterNumber(request.getChapterNumber())
                .price(request.getPrice())
                .status(request.getStatus())
                .comic(comic)
                .build();

        Chapter savedChapter = chapterRepository.save(chapter);
        final Chapter finalChapter = savedChapter;

        // Create detail chapters for images
        List<DetailChapter> detailChapters = request.getImageUrls().stream()
                .map(imageUrl -> {
                    DetailChapter detail = new DetailChapter();
                    detail.setImgUrl(imageUrl);
                    detail.setChapter(finalChapter);
                    return detail;
                })
                .collect(Collectors.toList());

        savedChapter.setDetailChapters(detailChapters);

        // Update comic's last chapter
        comic.setLastChapterId(savedChapter.getId());
        comicRepository.save(comic);

        savedChapter = chapterRepository.save(savedChapter);
        return BaseResponse.success(savedChapter);
    }

    @Override
    @Transactional
    public BaseResponse<Chapter> updateChapter(User publisher, String chapterId, PublisherChapterRequest request) {
        validateChapterOwnership(publisher, chapterId);
        Chapter chapter = findChapterById(chapterId);

        // Check if chapter number exists (excluding current chapter)
        if (!chapter.getChapterNumber().equals(request.getChapterNumber()) &&
                chapterRepository.existsByComicAndChapterNumber(chapter.getComic(), request.getChapterNumber())) {
            throw new BaseException(ErrorCode.CHAPTER_NUMBER_EXISTS);
        }

        chapter.setTitle(request.getTitle());
        chapter.setChapterNumber(request.getChapterNumber());
        chapter.setPrice(request.getPrice());
        chapter.setStatus(request.getStatus());

        // Update detail chapters
        chapter.getDetailChapters().clear();
        List<DetailChapter> detailChapters = request.getImageUrls().stream()
                .map(imageUrl -> {
                    DetailChapter detail = new DetailChapter();
                    detail.setImgUrl(imageUrl);
                    detail.setChapter(chapter);
                    return detail;
                })
                .collect(Collectors.toList());
        chapter.setDetailChapters(detailChapters);

        Chapter savedChapter = chapterRepository.save(chapter);
        return BaseResponse.success(savedChapter);
    }

    @Override
    @Transactional
    public BaseResponse<Void> deleteChapter(User publisher, String chapterId) {
        validateChapterOwnership(publisher, chapterId);
        Chapter chapter = findChapterById(chapterId);

        chapterRepository.delete(chapter);
        return BaseResponse.success("Xóa chương thành công");
    }

    @Override
    public BaseResponse<List<Chapter>> getChaptersByComic(User publisher, String comicId, int page, int limit) {
        validateComicOwnership(publisher, comicId);
        Comic comic = findComicById(comicId);

        Pageable pageable = PaginationUtils.createPageable(page, limit);
        Page<Chapter> chapters = chapterRepository.findByComicOrderByChapterNumberAsc(comic, pageable);

        return BaseResponse.success(
                chapters.getContent(),
                page,
                (int) chapters.getTotalElements(),
                limit,
                chapters.getTotalPages());
    }

    @Override
    public BaseResponse<PublisherStatsResponse> getPublisherStats(User publisher) {
        PublisherStatsResponse stats = PublisherStatsResponse.builder()
                .totalComics(comicRepository.countByPublisher(publisher))
                .totalRevenue(transactionRepository.getTotalRevenueByPublisher(publisher))
                .availableBalance(calculateAvailableBalance(publisher))
                .totalWithdrawn(withdrawalRequestRepository.getTotalWithdrawnAmountByPublisher(publisher))
                .pendingWithdrawal(withdrawalRequestRepository.getTotalPendingAmountByPublisher(publisher))
                .build();

        return BaseResponse.success(stats);
    }

    @Override
    public BaseResponse<Double> getAvailableBalance(User publisher) {
        Double balance = calculateAvailableBalance(publisher);
        return BaseResponse.success(balance);
    }

    @Override
    @Transactional
    public BaseResponse<WithdrawalRequest> createWithdrawalRequest(User publisher, WithdrawalRequestDto request) {
        // Check if publisher has pending withdrawal
        if (withdrawalRequestRepository.existsByPublisherAndStatus(publisher, WithdrawalStatus.PENDING)) {
            throw new BaseException(ErrorCode.WITHDRAWAL_PENDING_EXISTS);
        }

        // Check available balance
        Double availableBalance = calculateAvailableBalance(publisher);
        if (availableBalance < request.getAmount()) {
            throw new BaseException(ErrorCode.WITHDRAWAL_INSUFFICIENT_BALANCE);
        }

        WithdrawalRequest withdrawalRequest = WithdrawalRequest.builder()
                .publisher(publisher)
                .amount(request.getAmount())
                .bankName(request.getBankName())
                .bankAccountNumber(request.getBankAccountNumber())
                .bankAccountName(request.getBankAccountName())
                .status(WithdrawalStatus.PENDING)
                .build();

        WithdrawalRequest savedRequest = withdrawalRequestRepository.save(withdrawalRequest);
        return BaseResponse.success(savedRequest);
    }

    @Override
    public BaseResponse<List<WithdrawalRequest>> getMyWithdrawalRequests(User publisher, int page, int limit) {
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        Page<WithdrawalRequest> requests = withdrawalRequestRepository.findByPublisher(publisher, pageable);

        return BaseResponse.success(
                requests.getContent(),
                page,
                (int) requests.getTotalElements(),
                limit,
                requests.getTotalPages());
    }

    @Override
    public void validateComicOwnership(User publisher, String comicId) {
        Comic comic = findComicById(comicId);

        if (!comic.getPublisher().getId().equals(publisher.getId())) {
            throw new BaseException(ErrorCode.PUBLISHER_COMIC_NOT_OWNER);
        }
    }

    @Override
    public void validateChapterOwnership(User publisher, String chapterId) {
        Chapter chapter = findChapterById(chapterId);

        if (!chapter.getComic().getPublisher().getId().equals(publisher.getId())) {
            throw new BaseException(ErrorCode.PUBLISHER_COMIC_NOT_OWNER);
        }
    }

    // Helper methods
    private Comic findComicById(String comicId) {
        ValidationUtils.checkNullId(comicId);
        return comicRepository.findById(comicId)
                .orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));
    }

    private Chapter findChapterById(String chapterId) {
        ValidationUtils.checkNullId(chapterId);
        return chapterRepository.findById(chapterId)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));
    }

    private Double calculateAvailableBalance(User publisher) {
        Double totalRevenue = transactionRepository.getTotalRevenueByPublisher(publisher);
        Double totalWithdrawn = withdrawalRequestRepository.getTotalWithdrawnAmountByPublisher(publisher);
        Double pendingWithdrawal = withdrawalRequestRepository.getTotalPendingAmountByPublisher(publisher);

        return (totalRevenue != null ? totalRevenue : 0.0) -
                (totalWithdrawn != null ? totalWithdrawn : 0.0) -
                (pendingWithdrawal != null ? pendingWithdrawal : 0.0);
    }

    private String generateSlug(String name) {
        String slug = Normalizer.normalize(name.toLowerCase(), Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        slug = pattern.matcher(slug).replaceAll("");
        slug = slug.replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        return slug;
    }

    private PublisherComicResponse convertToPublisherComicResponse(Comic comic) {
        return PublisherComicResponse.builder()
                .id(comic.getId())
                .name(comic.getName())
                .slug(comic.getSlug())
                .originName(comic.getOriginName())
                .thumbUrl(comic.getThumbUrl())
                .author(comic.getAuthor())
                .status(comic.getStatus())
                .description(comic.getDescription())
                .followersCount(comic.getFollowersCount())
                .viewsCount(comic.getViewsCount())
                .categories(comic.getCategories().stream().collect(Collectors.toList()))
                .createdAt(comic.getCreatedAt())
                .updatedAt(comic.getUpdatedAt())
                .lastChapterId(comic.getLastChapterId())
                .build();
    }
}