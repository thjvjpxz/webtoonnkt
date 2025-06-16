package com.thjvjpxx.backend_comic.service;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.LevelRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.Level;

/**
 * Service xử lý logic liên quan đến level
 */
public interface LevelService {
    /**
     * Lấy danh sách level với phân trang và tìm kiếm
     * 
     * @param page   Số trang
     * @param limit  Số lượng trong 1 trang
     * @param search Từ khóa tìm kiếm
     * @return Response chứa danh sách level
     */
    BaseResponse<?> getLevelWithPagination(int page, int limit, String search);

    /**
     * Lấy tất cả level
     * 
     * @return Response chứa danh sách level
     */
    BaseResponse<?> getAllLevel();

    /**
     * Tạo level mới
     * 
     * @param request DTO chứa thông tin level
     * @param file    File ảnh
     * @return Response chứa level đã tạo
     */
    BaseResponse<?> createLevel(LevelRequest request, MultipartFile file);

    /**
     * Cập nhật level
     * 
     * @param id      ID level
     * @param request DTO chứa thông tin level
     * @param file    File ảnh
     * @return Response chứa level đã cập nhật
     */
    BaseResponse<?> updateLevel(String id, LevelRequest request, MultipartFile file);

    /**
     * Xóa level
     * 
     * @param id ID level
     * @return Response chứa thông báo thành công
     */
    BaseResponse<?> deleteLevel(String id);

    /**
     * Lấy level mặc định cho user
     * 
     * @return Response chứa level mặc định
     */
    Level getLevelDefaultUser();

    /**
     * Lấy level theo id
     * 
     * @param id ID level
     * @return Response chứa level
     */
    Level getLevelById(String id);

    /**
     * Lấy level theo type
     * 
     * @param levelTypeId ID level type
     * @return Response chứa danh sách level
     */
    BaseResponse<?> getLevelByType(String levelTypeId);
}
