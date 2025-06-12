package com.thjvjpxx.backend_comic.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.request.ChangePassRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.HomeService;
import com.thjvjpxx.backend_comic.service.VipPackageService;
import com.thjvjpxx.backend_comic.utils.SecurityUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class HomeController {
    HomeService homeService;
    SecurityUtils securityUtils;
    VipPackageService vipPackageService;

    @GetMapping
    public BaseResponse<?> getHomeComic() {
        return homeService.getHomeComic();
    }

    @GetMapping("category")
    public BaseResponse<?> getAllCategory() {
        return homeService.getAllCategory();
    }

    @GetMapping("category/{slug}")
    public BaseResponse<?> getComicByCategory(@PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return homeService.getComicByCategory(slug, page, size);
    }

    @GetMapping("search")
    public BaseResponse<?> searchComic(@RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return homeService.searchComic(query, page, size);
    }

    @GetMapping("favorites")
    public BaseResponse<?> getFavorites(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String currentUserId = securityUtils.getCurrentUserId();
        return homeService.getFavorites(currentUserId, page, size);
    }

    @GetMapping("profile")
    public BaseResponse<?> getProfile() {
        String currentUserId = securityUtils.getCurrentUserId();
        return homeService.getProfile(currentUserId);
    }

    @PutMapping("profile")
    public BaseResponse<?> updateProfile(@RequestBody Map<String, String> request) {
        String currentUserId = securityUtils.getCurrentUserId();
        String levelTypeId = request.get("levelTypeId");
        return homeService.updateProfile(currentUserId, levelTypeId);
    }

    @PostMapping("change-password")
    public BaseResponse<?> changePassword(@RequestBody ChangePassRequest request) {
        String currentUserId = securityUtils.getCurrentUserId();
        return homeService.changePassword(currentUserId, request);
    }

    @GetMapping("/public/vip-packages")
    public BaseResponse<?> getPublicVipPackages() {
        return vipPackageService.getPublicVipPackages();
    }
}
