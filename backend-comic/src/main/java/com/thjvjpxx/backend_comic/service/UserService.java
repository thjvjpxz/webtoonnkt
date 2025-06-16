package com.thjvjpxx.backend_comic.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.UserRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;

/**
 * Service xử lý logic liên quan đến user
 */
public interface UserService {
    /**
     * Lấy danh sách user
     * 
     * @param page    Trang hiện tại
     * @param limit   Số lượng mỗi trang
     * @param search  Từ khóa tìm kiếm
     * @param roleId  ID vai trò
     * @param deleted Trạng thái xóa
     * @return Response chứa danh sách user
     */
    BaseResponse<List<User>> getUsers(int page, int limit, String search, String roleId, Boolean deleted);

    /**
     * Tạo user mới
     * 
     * @param request Dữ liệu user
     * @param avatar  Ảnh đại diện
     * @return Response chứa user đã tạo
     */
    BaseResponse<User> createUser(UserRequest request, MultipartFile avatar);

    /**
     * Cập nhật user
     * 
     * @param id      ID user
     * @param request Dữ liệu user
     * @param avatar  Ảnh đại diện
     * @return Response chứa user đã cập nhật
     */
    BaseResponse<User> updateUser(String id, UserRequest request, MultipartFile avatar);

    /**
     * Khoá user
     * 
     * @param id ID user
     * @return Response chứa user đã khóa
     */
    BaseResponse<User> blockUser(String id);

    /**
     * Mở khóa user
     * 
     * @param id ID user
     * @return Response chứa user đã mở khóa
     */
    BaseResponse<User> unblockUser(String id);

    /**
     * Xóa user
     * 
     * @param id ID user
     * @return Response chứa user đã xóa
     */
    BaseResponse<User> deleteUser(String id);
}
