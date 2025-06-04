package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface DetailComicService {
    BaseResponse<?> getComicDetail(String slug);

    BaseResponse<?> followComic(String comicId, String userId);

    BaseResponse<?> unfollowComic(String comicId, String userId);

    BaseResponse<?> checkFollowStatus(String comicId, String userId);

    BaseResponse<?> getChapterDetail(String chapterId);
}
