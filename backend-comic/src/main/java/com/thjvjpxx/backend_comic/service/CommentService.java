package com.thjvjpxx.backend_comic.service;

import java.util.List;

import com.thjvjpxx.backend_comic.dto.request.CommentRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.CommentResponse;
import com.thjvjpxx.backend_comic.enums.CommentStatus;

/**
 * Service xử lý API quản lý comment
 */
public interface CommentService {

    /**
     * Lấy tất cả comment với phân trang và tìm kiếm
     * 
     * @param page      Trang hiện tại
     * @param limit     Số lượng mỗi trang
     * @param search    Tìm kiếm theo tên
     * @param comicId   ID comic
     * @param chapterId ID chapter
     * @param userId    ID user
     * @param status    Trạng thái
     * @return Response chứa danh sách comment
     */
    BaseResponse<List<CommentResponse>> getAllComments(int page, int limit, String search,
            String comicId, String chapterId,
            String userId, CommentStatus status);

    /**
     * Lấy comment theo chapter với phân trang
     * 
     * @param chapterId ID chapter
     * @param page      Trang hiện tại
     * @param limit     Số lượng mỗi trang
     * @return Response chứa danh sách comment
     */
    BaseResponse<List<CommentResponse>> getCommentsByChapter(String chapterId, int page, int limit);

    /**
     * Lấy comment cha (parent comments) theo comic
     * 
     * @param comicId ID comic
     * @param page    Trang hiện tại
     * @param limit   Số lượng mỗi trang
     * @return Response chứa danh sách comment cha
     */
    BaseResponse<List<CommentResponse>> getParentCommentsByComic(String comicId, int page, int limit);

    /**
     * Lấy reply comments theo parent comment id
     * 
     * @param parentId ID parent comment
     * @return Response chứa danh sách reply comment
     */
    BaseResponse<List<CommentResponse>> getRepliesByParentId(String parentId);

    /**
     * Lấy chi tiết comment theo id
     * 
     * @param id ID comment
     * @return Response chứa comment
     */
    BaseResponse<CommentResponse> getCommentById(String id);

    /**
     * Tạo comment mới
     * 
     * @param request DTO chứa thông tin comment
     * @param userId  ID user
     * @return Response chứa comment đã tạo
     */
    BaseResponse<CommentResponse> createComment(CommentRequest request, String userId);

    /**
     * Xóa comment (soft delete)
     * 
     * @param id     ID comment
     * @param userId ID user
     * @return Response chứa comment đã xóa
     */
    BaseResponse<String> deleteComment(String id, String userId);

    /**
     * Chặn comment (chuyển status thành BLOCKED) - chỉ admin
     * 
     * @param id ID comment
     * @return Response chứa comment đã chặn
     */
    BaseResponse<String> blockComment(String id);

    /**
     * Bỏ chặn comment (chuyển status thành ACTIVE) - chỉ admin
     * 
     * @param id ID comment
     * @return Response chứa comment đã bỏ chặn
     */
    BaseResponse<String> unblockComment(String id);

    /**
     * Đếm số comment theo comic
     * 
     * @param comicId ID comic
     * @return Response chứa số lượng comment
     */
    BaseResponse<Long> countCommentsByComic(String comicId);

    /**
     * Đếm số comment theo chapter
     * 
     * @param chapterId ID chapter
     * @return Response chứa số lượng comment
     */
    BaseResponse<Long> countCommentsByChapter(String chapterId);
}