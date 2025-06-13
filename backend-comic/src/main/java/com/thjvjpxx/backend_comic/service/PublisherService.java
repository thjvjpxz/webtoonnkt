package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;

public interface PublisherService {

	BaseResponse<?> getMyComics(User currentUser, String search, String status,
			String category, int page, int limit);

	BaseResponse<?> getAllChapters(User currentUser, int page, int limit, String search, String comicId);

}