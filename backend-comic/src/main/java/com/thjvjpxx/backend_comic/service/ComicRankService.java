package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface ComicRankService {
    BaseResponse<?> getTopDay(int page, int limit);

    BaseResponse<?> getTopWeek(int page, int limit);

    BaseResponse<?> getTopMonth(int page, int limit);

    BaseResponse<?> getFavorite(int page, int limit);

    BaseResponse<?> getLastUpdate(int page, int limit);

    BaseResponse<?> getNew(int page, int limit);

    BaseResponse<?> getFull(int page, int limit);
}
