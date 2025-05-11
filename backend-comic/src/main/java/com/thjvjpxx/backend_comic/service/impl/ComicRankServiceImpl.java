package com.thjvjpxx.backend_comic.service.impl;

import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.ComicRankService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ComicRankServiceImpl implements ComicRankService {

    @Override
    public BaseResponse<?> getTopDay(int page, int limit) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getTopDay'");
    }

    @Override
    public BaseResponse<?> getTopWeek(int page, int limit) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getTopWeek'");
    }

    @Override
    public BaseResponse<?> getTopMonth(int page, int limit) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getTopMonth'");
    }

    @Override
    public BaseResponse<?> getFavorite(int page, int limit) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getFavorite'");
    }

    @Override
    public BaseResponse<?> getLastUpdate(int page, int limit) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getLastUpdate'");
    }

    @Override
    public BaseResponse<?> getNew(int page, int limit) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getNew'");
    }

    @Override
    public BaseResponse<?> getFull(int page, int limit) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getFull'");
    }

}
