package com.thjvjpxx.backend_comic.service;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;

/**
 * Service xử lý API quản lý truyện tranh
 */
public interface ComicService {
    /**
     * Lấy tất cả truyện tranh
     * 
     * @param page     Trang hiện tại
     * @param limit    Số lượng mỗi trang
     * @param search   Tìm kiếm theo tên truyện
     * @param status   Lọc theo trạng thái truyện
     * @param category Lọc theo danh mục truyện
     * @return Response chứa danh sách truyện tranh
     */
    BaseResponse<?> getAllComics(int page, int limit, String search, String status, String category);

    /**
     * Tạo truyện tranh mới
     * 
     * @param comic     DTO chứa thông tin truyện tranh
     * @param cover     File ảnh bìa truyện
     * @param publisher Người dùng publisher
     * @return Response chứa truyện tranh đã tạo
     */
    BaseResponse<?> createComic(ComicRequest comic, MultipartFile cover, User publisher);

    /**
     * Cập nhật truyện tranh
     * 
     * @param id        ID truyện tranh
     * @param comic     DTO chứa thông tin truyện tranh
     * @param cover     File ảnh bìa truyện (có thể null nếu không cập nhật)
     * @param publisher Người dùng publisher
     * @return Response chứa truyện tranh đã cập nhật
     */
    BaseResponse<?> updateComic(String id, ComicRequest comic, MultipartFile cover, User publisher);

    /**
     * Xóa truyện tranh
     * 
     * @param id        ID truyện tranh
     * @param publisher Người dùng publisher
     * @return Response chứa kết quả xóa
     */
    BaseResponse<?> deleteComic(String id, User publisher);
}
