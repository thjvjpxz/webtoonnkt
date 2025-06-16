package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.LevelTypeRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.LevelType;

/**
 * Service xử lý logic liên quan đến level type
 */
public interface LevelTypeService {
    /**
     * Lấy tất cả level type
     * 
     * @return Response chứa danh sách level type
     */
    BaseResponse<?> getAllLevelType();

    /**
     * Lấy level type theo name
     * 
     * @param name Tên level type
     * @return Response chứa level type
     */
    LevelType getLevelTypeByName(String name);

    /**
     * Tạo level type mới
     * 
     * @param levelTypeRequest DTO chứa thông tin level type
     * @return Response chứa level type đã tạo
     */
    BaseResponse<?> createLevelType(LevelTypeRequest levelTypeRequest);

    /**
     * Cập nhật level type
     * 
     * @param id               ID level type
     * @param levelTypeRequest DTO chứa thông tin level type
     * @return Response chứa level type đã cập nhật
     */
    BaseResponse<?> updateLevelType(String id, LevelTypeRequest levelTypeRequest);

    /**
     * Xóa level type
     * 
     * @param id ID level type
     * @return Response chứa thông báo thành công
     */
    BaseResponse<?> deleteLevelType(String id);
}
