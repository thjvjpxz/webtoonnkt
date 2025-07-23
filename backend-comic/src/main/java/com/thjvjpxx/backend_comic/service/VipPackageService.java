package com.thjvjpxx.backend_comic.service;

import java.util.List;

import com.thjvjpxx.backend_comic.dto.request.VipPackageRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.VipPackage;

public interface VipPackageService {

    /**
     * Lấy danh sách tất cả gói VIP (có phân trang và tìm kiếm)
     * 
     * @param page     Trang hiện tại
     * @param limit    Số lượng mỗi trang
     * @param search   Từ khóa tìm kiếm
     * @param isActive Trạng thái hoạt động
     * @return Response chứa danh sách gói VIP
     */
    BaseResponse<List<VipPackage>> getAllVipPackages(int page, int limit, String search, Boolean isActive);

    /**
     * Lấy gói VIP theo ID
     * 
     * @param id ID gói VIP
     * @return Response chứa gói VIP
     */
    BaseResponse<VipPackage> getVipPackageById(String id);

    /**
     * Tạo gói VIP mới
     * 
     * @param request Dữ liệu gói VIP
     * @return Response chứa gói VIP đã tạo
     */
    BaseResponse<VipPackage> createVipPackage(VipPackageRequest request);

    /**
     * Cập nhật gói VIP
     * 
     * @param id      ID gói VIP
     * @param request Dữ liệu gói VIP
     * @return Response chứa gói VIP đã cập nhật
     */
    BaseResponse<VipPackage> updateVipPackage(String id, VipPackageRequest request);

    /**
     * Xóa gói VIP (soft delete - chuyển thành inactive)
     * 
     * @param id ID gói VIP
     * @return Response chứa gói VIP đã xóa
     */
    BaseResponse<VipPackage> deleteVipPackage(String id);

    /**
     * Xóa hoàn toàn gói VIP khỏi database
     * 
     * @param id ID gói VIP
     * @return Response chứa gói VIP đã xóa
     */
    BaseResponse<String> permanentDeleteVipPackage(String id);

    /**
     * Lấy danh sách gói VIP để hiển thị cho khách hàng (chỉ active)
     * 
     * @return Response chứa danh sách gói VIP
     */
    BaseResponse<List<VipPackage>> getPublicVipPackages();
}