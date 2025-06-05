package com.thjvjpxx.backend_comic.service;

import java.util.List;

import com.thjvjpxx.backend_comic.dto.request.CommentRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.CommentResponse;
import com.thjvjpxx.backend_comic.enums.CommentStatus;

public interface CommentService {

    // Lấy tất cả comment với phân trang và tìm kiếm
    BaseResponse<List<CommentResponse>> getAllComments(int page, int limit, String search,
            String comicId, String chapterId,
            String userId, CommentStatus status);

    // Lấy comment theo comic với phân trang
    BaseResponse<List<CommentResponse>> getCommentsByComic(String comicId, int page, int limit);

    // Lấy comment theo chapter với phân trang
    BaseResponse<List<CommentResponse>> getCommentsByChapter(String chapterId, int page, int limit);

    // Lấy comment theo user với phân trang
    BaseResponse<List<CommentResponse>> getCommentsByUser(String userId, int page, int limit);

    // Lấy comment cha (parent comments) theo comic
    BaseResponse<List<CommentResponse>> getParentCommentsByComic(String comicId, int page, int limit);

    // Lấy reply comments theo parent comment id
    BaseResponse<List<CommentResponse>> getRepliesByParentId(String parentId);

    // Lấy chi tiết comment theo id
    BaseResponse<CommentResponse> getCommentById(String id);

    // Tạo comment mới
    BaseResponse<CommentResponse> createComment(CommentRequest request, String userId);

    // Cập nhật comment
    BaseResponse<CommentResponse> updateComment(String id, CommentRequest request, String userId);

    // Xóa comment (soft delete - chuyển status thành DELETED)
    BaseResponse<String> deleteComment(String id, String userId);

    // Chặn comment (chuyển status thành BLOCKED) - chỉ admin
    BaseResponse<String> blockComment(String id);

    // Bỏ chặn comment (chuyển status thành ACTIVE) - chỉ admin
    BaseResponse<String> unblockComment(String id);

    // Đếm số comment theo comic
    BaseResponse<Long> countCommentsByComic(String comicId);

    // Đếm số comment theo chapter
    BaseResponse<Long> countCommentsByChapter(String chapterId);

    // Lấy comment mới nhất theo comic
    BaseResponse<List<CommentResponse>> getLatestCommentsByComic(String comicId, int limit);
}