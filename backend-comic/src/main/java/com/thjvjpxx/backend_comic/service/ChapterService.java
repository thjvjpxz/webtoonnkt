package com.thjvjpxx.backend_comic.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;

/**
 * Service xử lý API quản lý chương
 */
public interface ChapterService {

    /**
     * Lấy tất cả chương
     * 
     * @param page    Trang hiện tại
     * @param limit   Số lượng mỗi trang
     * @param search  Tìm kiếm theo tên
     * @param comicId ID comic
     * @return Response chứa danh sách chương
     */
    BaseResponse<?> getAllChapters(int page, int limit, String search, String comicId);

    /**
     * Tạo chương mới
     * 
     * @param chapterRequest DTO chứa thông tin chương
     * @param files          Danh sách file ảnh
     * @param publisher      Người dùng publisher
     * @return Response chứa chương đã tạo
     */
    BaseResponse<?> createChapter(ChapterRequest chapterRequest, List<MultipartFile> files, User publisher);

    /**
     * Cập nhật chương
     * 
     * @param id             ID chương
     * @param chapterRequest DTO chứa thông tin chương
     * @param files          Danh sách file ảnh
     * @param publisher      Người dùng publisher
     * @return Response chứa chương đã cập nhật
     */
    BaseResponse<?> updateChapter(String id, ChapterRequest chapterRequest, List<MultipartFile> files, User publisher);

    /**
     * Xóa chương
     * 
     * @param id        ID chương
     * @param publisher Người dùng publisher
     * @return Response chứa chương đã xóa
     */
    BaseResponse<?> deleteChapter(String id, User publisher);
}
