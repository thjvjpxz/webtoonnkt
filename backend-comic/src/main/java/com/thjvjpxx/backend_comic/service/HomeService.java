package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.ChangePassRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

/**
 * Service xử lý API trang chủ
 */
public interface HomeService {
    /**
     * Lấy danh sách comic
     * 
     * @return Response chứa danh sách comic
     */
    public BaseResponse<?> getHomeComic();

    /**
     * Lấy danh sách category
     * 
     * @return Response chứa danh sách category
     */
    public BaseResponse<?> getAllCategory();

    /**
     * Lấy danh sách comic theo category
     * 
     * @param slug Slug category
     * @param page Số trang
     * @param size Số lượng trong 1 trang
     * @return Response chứa danh sách comic theo category
     */
    public BaseResponse<?> getComicByCategory(String slug, int page, int size);

    /**
     * Tìm kiếm comic
     * 
     * @param query Từ khóa tìm kiếm
     * @param page  Số trang
     * @param size  Số lượng trong 1 trang
     * @return Response chứa danh sách comic theo từ khóa
     */
    public BaseResponse<?> searchComic(String query, int page, int size);

    /**
     * Lấy danh sách comic yêu thích
     * 
     * @param currentUserId ID user
     * @param page          Số trang
     * @param size          Số lượng trong 1 trang
     * @return Response chứa danh sách comic yêu thích
     */
    public BaseResponse<?> getFavorites(String currentUserId, int page, int size);

    /**
     * Lấy thông tin user
     * 
     * @param currentUserId ID user
     * @return Response chứa thông tin user
     */
    public BaseResponse<?> getProfile(String currentUserId);

    /**
     * Cập nhật thông tin user
     * 
     * @param currentUserId ID user
     * @param levelTypeId   ID level type
     * @return Response chứa thông tin user đã cập nhật
     */
    public BaseResponse<?> updateProfile(String currentUserId, String levelTypeId);

    /**
     * Thay đổi mật khẩu
     * 
     * @param currentUserId ID user
     * @param request       DTO chứa thông tin mật khẩu mới
     * @return Response chứa thông tin user đã thay đổi mật khẩu
     */
    public BaseResponse<?> changePassword(String currentUserId, ChangePassRequest request);
}
