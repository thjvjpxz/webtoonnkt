package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.PublisherChapterRequest;
import com.thjvjpxx.backend_comic.dto.request.PublisherComicRequest;
import com.thjvjpxx.backend_comic.dto.request.WithdrawalRequestDto;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherComicResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherStatsResponse;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.WithdrawalRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PublisherService {

    // Comic management
    BaseResponse<Comic> createComic(String currentUserId, PublisherComicRequest request, MultipartFile coverFile);

    BaseResponse<Comic> updateComic(String currentUserId, String comicId, PublisherComicRequest request,
            MultipartFile coverFile);

    BaseResponse<Void> deleteComic(String currentUserId, String comicId);

    BaseResponse<List<PublisherComicResponse>> getMyComics(String currentUserId, String search, String status,
            String category, int page, int size);

    BaseResponse<PublisherComicResponse> getMyComic(User publisher, String comicId);

    // Chapter management
    BaseResponse<Chapter> createChapter(User publisher, String comicId, PublisherChapterRequest request);

    BaseResponse<Chapter> updateChapter(User publisher, String chapterId, PublisherChapterRequest request);

    BaseResponse<Void> deleteChapter(User publisher, String chapterId);

    BaseResponse<List<Chapter>> getChaptersByComic(User publisher, String comicId, int page, int limit);

    // Revenue & Analytics
    BaseResponse<PublisherStatsResponse> getPublisherStats(User publisher);

    BaseResponse<Double> getAvailableBalance(User publisher);

    // Withdrawal
    BaseResponse<WithdrawalRequest> createWithdrawalRequest(User publisher, WithdrawalRequestDto request);

    BaseResponse<List<WithdrawalRequest>> getMyWithdrawalRequests(User publisher, int page, int limit);

    // Validation helpers
    void validateComicOwnership(User publisher, String comicId);

    void validateChapterOwnership(User publisher, String chapterId);
}