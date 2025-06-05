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
     */
    @GetMapping("/{parentId}/replies")
    public BaseResponse<List<CommentResponse>> getRepliesByParentId(@PathVariable String parentId) {
        return commentService.getRepliesByParentId(parentId);
    }

    /**
     * Lấy chi tiết comment theo ID
     * GET /comments/{id}
     */
    @GetMapping("/{id}")
    public BaseResponse<CommentResponse> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id);
    }

    /**
     * Tạo comment mới
     * POST /comments
     */
    @PostMapping
    public BaseResponse<CommentResponse> createComment(@Valid @RequestBody CommentRequest request) {
        String currentUserId = securityUtils.getCurrentUserId();
        return commentService.createComment(request, currentUserId);
    }


    /**
     * Xóa comment (soft delete)
     * DELETE /comments/{id}
     */
    @DeleteMapping("/{id}")
    public BaseResponse<String> deleteComment(@PathVariable String id) {
        String currentUserId = securityUtils.getCurrentUserId();
        return commentService.deleteComment(id, currentUserId);
    }

    /**
     * Chặn comment (chỉ admin)
     * POST /comments/{id}/block
     */
    @PostMapping("/{id}/block")
    public BaseResponse<String> blockComment(@PathVariable String id) {
        return commentService.blockComment(id);
    }

    /**
     * Bỏ chặn comment (chỉ admin)
     * POST /comments/{id}/unblock
     */
    @PostMapping("/{id}/unblock")
    public BaseResponse<String> unblockComment(@PathVariable String id) {
        return commentService.unblockComment(id);
    }

    /**
     * Đếm số comment theo comic
     * GET /comments/comic/{comicId}/count
     */
    @GetMapping("/comic/{comicId}/count")
    public BaseResponse<Long> countCommentsByComic(@PathVariable String comicId) {
        return commentService.countCommentsByComic(comicId);
    }

    /**
     * Đếm số comment theo chapter
     * GET /comments/chapter/{chapterId}/count
     */
    @GetMapping("/chapter/{chapterId}/count")
    public BaseResponse<Long> countCommentsByChapter(@PathVariable String chapterId) {
        return commentService.countCommentsByChapter(chapterId);
    }

    /**
     * Lấy comment của user hiện tại
     * GET /comments/my-comments?page=0&limit=10
     */
    @GetMapping("/my-comments")
    public BaseResponse<List<CommentResponse>> getMyComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        String currentUserId = securityUtils.getCurrentUserId();
        return commentService.getCommentsByUser(currentUserId, page, limit);
    }
}