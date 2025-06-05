package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.ChangePassRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface HomeService {
    public BaseResponse<?> getHomeComic();

    public BaseResponse<?> getAllCategory();

    public BaseResponse<?> getComicByCategory(String slug, int page, int size);

    public BaseResponse<?> searchComic(String query, int page, int size);

    public BaseResponse<?> getFavorites(String currentUserId, int page, int size);

    public BaseResponse<?> getProfile(String currentUserId);

    public BaseResponse<?> updateProfile(String currentUserId, String levelTypeId);

    public BaseResponse<?> changePassword(String currentUserId, ChangePassRequest request);
}
