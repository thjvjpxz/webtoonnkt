package com.thjvjpxx.backend_comic.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ChangePassRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.service.HomeService;
import com.thjvjpxx.backend_comic.service.PublisherRequestService;
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
    PublisherRequestService publisherRequestService;

    /**
     * API lấy danh sách comic mới nhất
     * GET /
     * 
     * @return Response chứa danh sách comic mới nhất
     */
    @GetMapping
    public BaseResponse<?> getHomeComic() {
        return homeService.getHomeComic();
    }

    /**
     * API lấy danh sách category
     * GET /category
     * 
     * @return Response chứa danh sách category
     */
    @GetMapping("category")
    public BaseResponse<?> getAllCategory() {
        return homeService.getAllCategory();
    }

    /**
     * API lấy danh sách comic theo category
     * GET /category/{slug}
     * 
     * @param slug Slug của category
     * @param page Số trang
     * @param size Số lượng trong 1 trang
     * @return Response chứa danh sách comic theo category
     */
    @GetMapping("category/{slug}")
    public BaseResponse<?> getComicByCategory(@PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return homeService.getComicByCategory(slug, page, size);
    }

    /**
     * API tìm kiếm comic
     * GET /search
     * 
     * @param query Từ khóa tìm kiếm
     * @param page  Số trang
     * @param size  Số lượng
     * @return Response chứa danh sách comic tìm kiếm
     */
    @GetMapping("search")
    public BaseResponse<?> searchComic(@RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return homeService.searchComic(query, page, size);
    }

    /**
     * API lấy danh sách yêu thích
     * GET /favorites
     * 
     * @param page Số trang
     * @param size Số lượng
     * @return Response chứa danh sách yêu thích
     */
    @GetMapping("favorites")
    public BaseResponse<?> getFavorites(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = securityUtils.getCurrentUser();
        return homeService.getFavorites(user, page, size);
    }

    /**
     * API lấy thông tin cá nhân
     * GET /profile
     * 
     * @return Response chứa thông tin cá nhân
     */
    @GetMapping("profile")
    public BaseResponse<?> getProfile() {
        User user = securityUtils.getCurrentUser();
        return homeService.getProfile(user);
    }

    /**
     * API cập nhật thông tin cá nhân
     * PUT /profile
     * 
     * @param request DTO chứa levelTypeId
     * @return Response thông báo thành công
     */
    @PutMapping("profile")
    public BaseResponse<?> updateProfile(@RequestBody Map<String, String> request) {
        User user = securityUtils.getCurrentUser();
        String levelTypeId = request.get("levelTypeId");
        return homeService.updateProfile(user, levelTypeId);
    }

    /**
     * API thay đổi mật khẩu
     * POST /change-password
     * 
     * @param request DTO chứa oldPassword và newPassword
     * @return Response thông báo thành công
     */
    @PostMapping("change-password")
    public BaseResponse<?> changePassword(@RequestBody ChangePassRequest request) {
        User user = securityUtils.getCurrentUser();
        return homeService.changePassword(user, request);
    }

    /**
     * API thay đổi avatar
     * PUT /change-avatar
     * 
     * @param file File ảnh
     * @return Response thông báo thành công
     */
    @PutMapping("change-avatar")
    public BaseResponse<?> changeAvatar(@RequestPart("avatar") MultipartFile avatar) {
        User user = securityUtils.getCurrentUser();
        return homeService.changeAvatar(user, avatar);
    }

    /**
     * API lấy danh sách gói VIP công khai
     * GET /public/vip-packages
     * 
     * @return Response chứa danh sách gói VIP công khai
     */
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

    /**
     * Gửi yêu cầu trở thành publisher
     * POST /publisher-request
     * 
     * @return Response chứa thông báo thành công
     */
    @PostMapping("publisher-request")
    public BaseResponse<?> sendPublisherRequest() {
        return publisherRequestService.sendPublisherRequest(securityUtils.getCurrentUser());
    }
}
