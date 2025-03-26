package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.ComicService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ComicServiceImpl implements ComicService {
    ComicRepository comicRepository;

    @Override
    public BaseResponse<List<Comic>> getAllComics(int page, int limit, String search) {
        page = page < 0 ? 0 : page;
        limit = limit < 0 ? 5 : limit;

        int originalPage = page;

        page = page == 0 ? 0 : page - 1;

        Pageable pageable = PageRequest.of(page, limit);
        Page<Comic> comics = null;
        if (search != null && !search.isEmpty()) {
            comics = comicRepository.findBySlugContainingOrNameContaining(search, search, pageable);
        } else {
            comics = comicRepository.findAll(pageable);
        }
        return BaseResponse.success(
                comics.getContent(),
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<Comic> getComicById(String id) {
        if (id == null || id.isEmpty()) {
            throw new BaseException(ErrorCode.COMIC_NOT_FOUND);
        }
        Comic comic = comicRepository.findById(id).orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));
        return BaseResponse.success(comic);
    }

    @Override
    public BaseResponse<Comic> createComic(ComicRequest comic) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createComic'");
    }

    @Override
    public BaseResponse<Comic> updateComic(String id, ComicRequest comic) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateComic'");
    }

    @Override
    public BaseResponse<Comic> deleteComic(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteComic'");
    }

}
