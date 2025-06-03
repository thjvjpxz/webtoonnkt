package com.thjvjpxx.backend_comic.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.ComicRankService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ComicRankServiceImpl implements ComicRankService {

    ComicRepository comicRepository;

    @Override
    public BaseResponse<?> getTopDay(int page, int limit) {
        // Lấy truyện có lượt xem cao nhất
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        int originalPage = page;

        // Sắp xếp theo lượt xem giảm dần
        Sort sort = Sort.by(Sort.Direction.DESC, "viewsCount");
        PageRequest pageWithSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        Page<Comic> comics = comicRepository.findAll(pageWithSort);

        return BaseResponse.success(
                comics.getContent(),
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<?> getTopWeek(int page, int limit) {
        // Lấy truyện có lượt xem cao nhất trong tuần
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        int originalPage = page;

        // Sắp xếp theo lượt xem giảm dần
        Sort sort = Sort.by(Sort.Direction.DESC, "viewsCount");
        PageRequest pageWithSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        // Lọc theo truyện được cập nhật trong tuần qua
        LocalDateTime oneWeekAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        Page<Comic> comics = comicRepository.findByUpdatedAtAfter(oneWeekAgo, pageWithSort);

        return BaseResponse.success(
                comics.getContent(),
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<?> getTopMonth(int page, int limit) {
        // Lấy truyện có lượt xem cao nhất trong tháng
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        int originalPage = page;

        // Sắp xếp theo lượt xem giảm dần
        Sort sort = Sort.by(Sort.Direction.DESC, "viewsCount");
        PageRequest pageWithSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        // Lọc theo truyện được cập nhật trong tháng qua
        LocalDateTime oneMonthAgo = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
        Page<Comic> comics = comicRepository.findByUpdatedAtAfter(oneMonthAgo, pageWithSort);

        return BaseResponse.success(
                comics.getContent(),
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<?> getFavorite(int page, int limit) {
        // Lấy truyện có nhiều lượt theo dõi nhất
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        int originalPage = page;

        // Sắp xếp theo lượt theo dõi giảm dần
        Sort sort = Sort.by(Sort.Direction.DESC, "followersCount");
        PageRequest pageWithSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        Page<Comic> comics = comicRepository.findAll(pageWithSort);

        return BaseResponse.success(
                comics.getContent(),
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<?> getLastUpdate(int page, int limit) {
        // Lấy truyện mới cập nhật
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        int originalPage = page;

        // Sắp xếp theo thời gian cập nhật giảm dần (mới nhất lên đầu)
        Sort sort = Sort.by(Sort.Direction.DESC, "updatedAt");
        PageRequest pageWithSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        Page<Comic> comics = comicRepository.findAll(pageWithSort);

        return BaseResponse.success(
                comics.getContent(),
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<?> getNew(int page, int limit) {
        // Lấy truyện mới đăng
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        int originalPage = page;

        // Sắp xếp theo thời gian tạo giảm dần (mới nhất lên đầu)
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        PageRequest pageWithSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        Page<Comic> comics = comicRepository.findAll(pageWithSort);

        return BaseResponse.success(
                comics.getContent(),
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<?> getFull(int page, int limit) {
        // Lấy truyện đã hoàn thành
        Pageable pageable = PaginationUtils.createPageable(page, limit);
        int originalPage = page;

        // Sắp xếp theo thời gian cập nhật giảm dần (mới nhất lên đầu)
        Sort sort = Sort.by(Sort.Direction.DESC, "followersCount", "viewsCount");
        PageRequest pageWithSort = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        Page<Comic> comics = comicRepository.findByStatus(ComicStatus.COMPLETED, pageWithSort);

        return BaseResponse.success(
                comics.getContent(),
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }
}
