package com.thjvjpxx.backend_comic.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.enums.CommentStatus;
import com.thjvjpxx.backend_comic.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {

	// Tìm tất cả comment có phân trang
	Page<Comment> findAll(Pageable pageable);

	// Tìm comment theo comic id
	Page<Comment> findByComicId(String comicId, Pageable pageable);

	// Tìm comment theo comic id và trạng thái
	Page<Comment> findByComicIdAndStatus(String comicId, CommentStatus status, Pageable pageable);

	// Tìm comment theo chapter id
	Page<Comment> findByChapterId(String chapterId, Pageable pageable);

	// Tìm comment theo chapter id và trạng thái
	Page<Comment> findByChapterIdAndStatus(String chapterId, CommentStatus status, Pageable pageable);

	// Tìm comment theo user id
	Page<Comment> findByUserId(String userId, Pageable pageable);

	// Tìm comment theo user id và trạng thái
	Page<Comment> findByUserIdAndStatus(String userId, CommentStatus status, Pageable pageable);

	// Tìm comment cha (parent comment là null) theo comic
	Page<Comment> findByComicIdAndParentIsNull(String comicId, Pageable pageable);

	// Tìm comment cha theo comic và trạng thái
	Page<Comment> findByComicIdAndParentIsNullAndStatus(String comicId, CommentStatus status, Pageable pageable);

	// Tìm reply comment (comment con) theo parent id
	List<Comment> findByParentIdAndStatus(String parentId, CommentStatus status);

	// Tìm comment theo nội dung (tìm kiếm)
	Page<Comment> findByContentContainingIgnoreCase(String content, Pageable pageable);

	// Tìm comment theo comic id và nội dung
	Page<Comment> findByComicIdAndContentContainingIgnoreCase(String comicId, String content, Pageable pageable);

	// Tìm comment theo trạng thái
	Page<Comment> findByStatus(CommentStatus status, Pageable pageable);

	// Đếm số comment theo comic id
	long countByComicId(String comicId);

	// Đếm số comment theo comic id và trạng thái
	long countByComicIdAndStatus(String comicId, CommentStatus status);

	// Đếm số comment theo chapter id
	long countByChapterId(String chapterId);

	// Đếm số comment theo chapter id và trạng thái
	long countByChapterIdAndStatus(String chapterId, CommentStatus status);

	// Đếm số reply cho một comment
	long countByParentIdAndStatus(String parentId, CommentStatus status);

	// Query phức tạp: Tìm comment theo comic với thông tin user
	@Query("SELECT c FROM comments c JOIN FETCH c.user WHERE c.comic.id = :comicId AND c.status = :status ORDER BY c.createdAt DESC")
	List<Comment> findCommentsByComicWithUser(@Param("comicId") String comicId,
			@Param("status") CommentStatus status);

	// Query phức tạp: Tìm comment mới nhất theo comic
	@Query("SELECT c FROM comments c WHERE c.comic.id = :comicId AND c.status = :status ORDER BY c.createdAt DESC")
	Page<Comment> findLatestCommentsByComic(@Param("comicId") String comicId, @Param("status") CommentStatus status,
			Pageable pageable);

	// Query phức tạp: Tìm comment và reply của nó
	@Query("""
			SELECT c FROM comments c
			LEFT JOIN FETCH c.user
			WHERE c.comic.id = :comicId
			AND c.parent IS NULL
			AND c.status = :status
			ORDER BY c.createdAt DESC
			""")
	Page<Comment> findParentCommentsWithUser(@Param("comicId") String comicId,
			@Param("status") CommentStatus status,
			Pageable pageable);

	// Tìm comment theo nhiều tiêu chí
	@Query("""
			SELECT c FROM comments c
			WHERE (:comicId IS NULL OR c.comic.id = :comicId)
			AND (:chapterId IS NULL OR c.chapter.id = :chapterId)
			AND (:userId IS NULL OR c.user.id = :userId)
			AND (:status IS NULL OR c.status = :status)
			AND (:content IS NULL OR LOWER(c.content) LIKE LOWER(CONCAT('%', :content, '%')))
			ORDER BY c.createdAt DESC
			""")
	Page<Comment> findCommentsByCriteria(
			@Param("comicId") String comicId,
			@Param("chapterId") String chapterId,
			@Param("userId") String userId,
			@Param("status") CommentStatus status,
			@Param("content") String content,
			Pageable pageable);
}