package com.thjvjpxx.backend_comic.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.request.CommentRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.CommentResponse;
import com.thjvjpxx.backend_comic.enums.CommentStatus;
import com.thjvjpxx.backend_comic.service.CommentService;
import com.thjvjpxx.backend_comic.utils.SecurityUtils;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comments")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {

    CommentService commentService;
    SecurityUtils securityUtils;

    /**
     * Lấy tất cả comment với phân trang và lọc
     * GET /comments?page=0&limit=10&search=&comicId=&chapterId=&userId=&status=
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
    @GetMapping
    public BaseResponse<List<CommentResponse>> getAllComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String comicId,
            @RequestParam(required = false) String chapterId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) CommentStatus status) {
        return commentService.getAllComments(page, limit, search, comicId, chapterId, userId, status);
    }

    /**
     * Lấy comment cha (parent comments) theo comic ID - bao gồm reply
     * GET /comments/comic/{comicId}/parents?page=0&limit=10
     * 
     * @param comicId ID comic
     * @param page    Trang hiện tại
     * @param limit   Số lượng mỗi trang
     * @return Response chứa danh sách comment cha
     */
    @GetMapping("/comic/{comicId}/parents")
    public BaseResponse<List<CommentResponse>> getParentCommentsByComic(
            @PathVariable String comicId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return commentService.getParentCommentsByComic(comicId, page, limit);
    }

    /**
     * Lấy comment theo chapter ID
     * GET /comments/chapter/{chapterId}?page=0&limit=10
     * 
     * @param chapterId ID chapter
     * @param page      Trang hiện tại
     * @param limit     Số lượng mỗi trang
     * @return Response chứa danh sách comment
     */
    @GetMapping("/chapter/{chapterId}")
    public BaseResponse<List<CommentResponse>> getCommentsByChapter(
            @PathVariable String chapterId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return commentService.getCommentsByChapter(chapterId, page, limit);
    }

    /**
     * Lấy reply comments theo parent comment ID
     * GET /comments/{parentId}/replies
     * 
     * @param parentId ID parent comment
     * @return Response chứa danh sách reply comment
     */
    @GetMapping("/{parentId}/replies")
    public BaseResponse<List<CommentResponse>> getRepliesByParentId(@PathVariable String parentId) {
        return commentService.getRepliesByParentId(parentId);
    }

    /**
     * Lấy chi tiết comment theo ID
     * GET /comments/{id}
     * 
     * @param id ID comment
     * @return Response chứa comment
     */
    @GetMapping("/{id}")
    public BaseResponse<CommentResponse> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id);
    }

    /**
     * Tạo comment mới
     * POST /comments
     * 
     * @param request DTO chứa thông tin comment
     * @return Response chứa comment đã tạo
     */
    @PostMapping
    public BaseResponse<CommentResponse> createComment(@Valid @RequestBody CommentRequest request) {
        String currentUserId = securityUtils.getCurrentUserId();
        return commentService.createComment(request, currentUserId);
    }

    /**
     * Xóa comment (soft delete)
     * DELETE /comments/{id}
     * 
     * @param id ID comment
     * @return Response chứa comment đã xóa
     */
    @DeleteMapping("/{id}")
    public BaseResponse<String> deleteComment(@PathVariable String id) {
        String currentUserId = securityUtils.getCurrentUserId();
        return commentService.deleteComment(id, currentUserId);
    }

    /**
     * Chặn comment (chỉ admin)
     * POST /comments/{id}/block
     * 
     * @param id ID comment
     * @return Response chứa comment đã chặn
     */
    @PostMapping("/{id}/block")
    public BaseResponse<String> blockComment(@PathVariable String id) {
        return commentService.blockComment(id);
    }

    /**
     * Bỏ chặn comment (chỉ admin)
     * POST /comments/{id}/unblock
     * 
     * @param id ID comment
     * @return Response chứa comment đã bỏ chặn
     */
    @PostMapping("/{id}/unblock")
    public BaseResponse<String> unblockComment(@PathVariable String id) {
        return commentService.unblockComment(id);
    }

    /**
     * Đếm số comment theo comic
     * GET /comments/comic/{comicId}/count
     * 
     * @param comicId ID comic
     * @return Response chứa số lượng comment
     */
    @GetMapping("/comic/{comicId}/count")
    public BaseResponse<Long> countCommentsByComic(@PathVariable String comicId) {
        return commentService.countCommentsByComic(comicId);
    }

    /**
     * Đếm số comment theo chapter
     * GET /comments/chapter/{chapterId}/count
     * 
     * @param chapterId ID chapter
     * @return Response chứa số lượng comment
     */
    @GetMapping("/chapter/{chapterId}/count")
    public BaseResponse<Long> countCommentsByChapter(@PathVariable String chapterId) {
        return commentService.countCommentsByChapter(chapterId);
    }
}