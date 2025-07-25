package com.thjvjpxx.backend_comic.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.request.VipPackageRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.VipPackage;
import com.thjvjpxx.backend_comic.service.VipPackageService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("/vip-packages")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VipPackageController {

    VipPackageService vipPackageService;

    /**
     * Lấy danh sách tất cả gói VIP (có phân trang và tìm kiếm)
     * GET /vip-packages?page=0&limit=10&search=premium
     * 
     * @param page     Trang hiện tại
     * @param limit    Số lượng mỗi trang
     * @param search   Từ khóa tìm kiếm
     * @param isActive Trạng thái hoạt động
     * @return Response chứa danh sách gói VIP
     */
    @GetMapping
    public BaseResponse<List<VipPackage>> getAllVipPackages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean isActive) {
        return vipPackageService.getAllVipPackages(page, limit, search, isActive);
    }

    /**
     * Lấy gói VIP theo ID
     * GET /vip-packages/{id}
     * 
     * @param id ID gói VIP
     * @return Response chứa gói VIP
     */
    @GetMapping("/{id}")
    public BaseResponse<VipPackage> getVipPackageById(@PathVariable String id) {
        return vipPackageService.getVipPackageById(id);
    }

    /**
     * Tạo gói VIP mới
     * POST /vip-packages
     * 
     * @param request Dữ liệu gói VIP
     * @return Response chứa gói VIP đã tạo
     */
    @PostMapping
    public BaseResponse<VipPackage> createVipPackage(@Valid @RequestBody VipPackageRequest request) {
        return vipPackageService.createVipPackage(request);
    }

    /**
     * Cập nhật gói VIP
     * PUT /vip-packages/{id}
     * 
     * @param id      ID gói VIP
     * @param request Dữ liệu gói VIP
     * @return Response chứa gói VIP đã cập nhật
     */
    @PutMapping("/{id}")
    public BaseResponse<VipPackage> updateVipPackage(
            @PathVariable String id,
            @Valid @RequestBody VipPackageRequest request) {
        return vipPackageService.updateVipPackage(id, request);
    }

    /**
     * Xóa gói VIP (soft delete - chuyển thành inactive)
     * DELETE /vip-packages/{id}
     * 
     * @param id ID gói VIP
     * @return Response chứa gói VIP đã xóa
     */
    @DeleteMapping("/{id}")
    public BaseResponse<VipPackage> deleteVipPackage(@PathVariable String id) {
        return vipPackageService.deleteVipPackage(id);
    }

    /**
     * Xóa hoàn toàn gói VIP khỏi database
     * DELETE /vip-packages/{id}/permanent
     * 
     * @param id ID gói VIP
     * @return Response chứa gói VIP đã xóa
     */
    @DeleteMapping("/{id}/permanent")
    public BaseResponse<String> permanentDeleteVipPackage(@PathVariable String id) {
        return vipPackageService.permanentDeleteVipPackage(id);
    }
}