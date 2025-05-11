package com.thjvjpxx.backend_comic.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.ComicRankService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/public")
public class ComicRankController {
    ComicRankService comicRankService;

    @GetMapping("/top-day")
    public BaseResponse<?> getTopDay(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "42") int limit) {
        return comicRankService.getTopDay(page, limit);
    }

    @GetMapping("/top-week")
    public BaseResponse<?> getTopWeek(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "42") int limit) {
        return comicRankService.getTopWeek(page, limit);
    }

    @GetMapping("/top-month")
    public BaseResponse<?> getTopMonth(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "42") int limit) {
        return comicRankService.getTopMonth(page, limit);
    }

    @GetMapping("/favorite")
    public BaseResponse<?> getFavorite(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "42") int limit) {
        return comicRankService.getFavorite(page, limit);
    }

    @GetMapping("/last-update")
    public BaseResponse<?> getLastUpdate(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "42") int limit) {
        return comicRankService.getLastUpdate(page, limit);
    }

    @GetMapping("/new")
    public BaseResponse<?> getNew(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "42") int limit) {
        return comicRankService.getNew(page, limit);
    }

    @GetMapping("/full")
    public BaseResponse<?> getFull(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "42") int limit) {
        return comicRankService.getFull(page, limit);
    }
}
