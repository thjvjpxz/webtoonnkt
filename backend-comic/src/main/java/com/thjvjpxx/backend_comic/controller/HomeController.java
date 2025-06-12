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
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.service.HomeService;
import com.thjvjpxx.backend_comic.service.PurchaseService;
import com.thjvjpxx.backend_comic.service.VipPackageService;
import com.thjvjpxx.backend_comic.utils.SecurityUtils;

import jakarta.validation.Valid;
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
    PurchaseService purchaseService;

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

    /**
     * API mua gói VIP
     * POST /purchase/vip
     * 
     * @param request DTO chứa vipPackageId
     * @return Response thông báo mua thành công và thời hạn VIP
     */
    @PostMapping("purchase/vip")
    public BaseResponse<?> purchaseVipPackage(@Valid @RequestBody Map<String, String> request) {
        String vipPackageId = request.get("vipPackageId");
        if (vipPackageId == null || vipPackageId.isEmpty()) {
            throw new BaseException(ErrorCode.VIP_PACKAGE_ID_NOT_EMPTY);
        }
        return purchaseService.purchaseVipPackage(vipPackageId, securityUtils.getCurrentUser());
    }

    /**
     * API mua chapter có phí
     * POST /purchase/chapter
     * 
     * @param request DTO chứa chapterId
     * @return Response thông báo mua thành công
     */
    @PostMapping("purchase/chapter")
    public BaseResponse<?> purchaseChapter(@Valid @RequestBody Map<String, String> request) {
        String chapterId = request.get("chapterId");
        if (chapterId == null || chapterId.isEmpty()) {
            throw new BaseException(ErrorCode.CHAPTER_NOT_FOUND);
        }
        return purchaseService.purchaseChapter(chapterId, securityUtils.getCurrentUser());
    }

    /**
     * API lấy thông tin VIP hiện tại của user
     * GET /my-vip
     * 
     * @return Response chứa thông tin VIP hiện tại hoặc thông báo chưa có VIP
     */
    @GetMapping("my-vip")
    public BaseResponse<?> getMyVipPackage() {
        return purchaseService.getMyPurchasedVipPackage(securityUtils.getCurrentUser());
    }
}
