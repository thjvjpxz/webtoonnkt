package com.thjvjpxx.backend_comic.service;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ChangePassRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;

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
    public BaseResponse<?> getFavorites(User user, int page, int size);

    /**
     * Lấy thông tin user
     * 
     * @param currentUserId ID user
     * @return Response chứa thông tin user
     */
    public BaseResponse<?> getProfile(User user);

    /**
     * Cập nhật thông tin user
     * 
     * @param currentUserId ID user
     * @param levelTypeId   ID level type
     * @return Response chứa thông tin user đã cập nhật
     */
    public BaseResponse<?> updateProfile(User user, String levelTypeId);

    /**
     * Thay đổi mật khẩu
     * 
     * @param currentUserId ID user
     * @param request       DTO chứa thông tin mật khẩu mới
     * @return Response chứa thông tin user đã thay đổi mật khẩu
     */
    public BaseResponse<?> changePassword(User user, ChangePassRequest request);

    /**
     * Thay đổi avatar
     * 
     * @param user User
     * @param file File ảnh
     * @return Response chứa thông tin user đã thay đổi avatar
     */
    public BaseResponse<?> changeAvatar(User user, MultipartFile file);
}
