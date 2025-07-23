package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;

/**
 * Service xử lý API mua truyện
 */
public interface PurchaseService {

    /**
     * Lấy danh sách gói VIP đã mua
     *
     * @param user Người dùng
     * @return Danh sách gói VIP đã mua
     */
    BaseResponse<?> getMyPurchasedVipPackage(User user);

    /**
     * Mua gói VIP
     * 
     * @param request DTO chứa thông tin gói VIP muốn mua
     * @param user    Người dùng mua VIP
     * @return Response chứa thông tin giao dịch
     */
    BaseResponse<?> purchaseVipPackage(String vipPackageId, User user);

    /**
     * Mua chapter có phí
     * 
     * @param chapterId ID chapter muốn mua
     * @param user      Người dùng mua chapter
     * @return Response chứa thông tin giao dịch
     */
    BaseResponse<?> purchaseChapter(String chapterId, User user);
}