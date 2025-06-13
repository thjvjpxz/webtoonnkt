package com.thjvjpxx.backend_comic.service;

import java.util.List;

import com.thjvjpxx.backend_comic.dto.request.VipPackageRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.VipPackage;

public interface VipPackageService {

    /**
     * Lấy danh sách tất cả gói VIP (có phân trang và tìm kiếm)
     */
    BaseResponse<List<VipPackage>> getAllVipPackages(int page, int limit, String search, Boolean isActive);

    /**
     * Lấy gói VIP theo ID
     */
    BaseResponse<VipPackage> getVipPackageById(String id);

    /**
     * Tạo gói VIP mới
     */
    BaseResponse<VipPackage> createVipPackage(VipPackageRequest request);

    /**
     * Cập nhật gói VIP
     */
    BaseResponse<VipPackage> updateVipPackage(String id, VipPackageRequest request);

    /**
     * Xóa gói VIP (soft delete - chuyển thành inactive)
     */
    BaseResponse<VipPackage> deleteVipPackage(String id);

    /**
     * Xóa hoàn toàn gói VIP khỏi database
     */
    BaseResponse<String> permanentDeleteVipPackage(String id);

    /**
     * Lấy danh sách gói VIP để hiển thị cho khách hàng (chỉ active)
     */
    BaseResponse<List<VipPackage>> getPublicVipPackages();
}