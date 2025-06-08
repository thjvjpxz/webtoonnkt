package com.thjvjpxx.backend_comic.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.PublisherChapterRequest;
import com.thjvjpxx.backend_comic.dto.request.PublisherComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherComicResponse;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.User;

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

	BaseResponse<Chapter> createChapterWithImages(User publisher, String comicId, PublisherChapterRequest request,
			List<MultipartFile> images);

	BaseResponse<Chapter> updateChapter(User publisher, String chapterId, PublisherChapterRequest request);

	BaseResponse<Chapter> updateChapterWithImages(User publisher, String chapterId, PublisherChapterRequest request,
			List<MultipartFile> images);

	BaseResponse<Void> deleteChapter(User publisher, String chapterId);

	BaseResponse<Void> deleteMultipleChapters(User publisher, List<String> chapterIds);

	BaseResponse<List<Chapter>> getChaptersByComic(User publisher, String comicId, int page, int limit);

	BaseResponse<?> getAllChapters(String currentUserId, int page, int limit, String search, String comicId);

	BaseResponse<Void> reorderChapter(User publisher, String chapterId, Double newChapterNumber);

	BaseResponse<ChapterStatsResponse> getChapterStats(User publisher, String chapterId);

	// Validation helpers
	void validateComicOwnershipByComicId(User publisher, String comicId);

	void validateComicOwnershipByChapterId(User publisher, String chapterId);
}