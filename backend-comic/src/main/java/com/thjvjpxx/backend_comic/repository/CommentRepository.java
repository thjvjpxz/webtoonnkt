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

	/**
	 * Tìm tất cả comment có phân trang
	 * @param pageable thông tin phân trang
	 * @return danh sách comment theo trang
	 */
	Page<Comment> findAll(Pageable pageable);

	/**
	 * Tìm comment theo comic id
	 * @param comicId id của comic
	 * @param pageable thông tin phân trang
	 * @return danh sách comment theo comic với phân trang
	 */
	Page<Comment> findByComicId(String comicId, Pageable pageable);

	/**
	 * Tìm comment theo comic id và trạng thái
	 * @param comicId id của comic
	 * @param status trạng thái comment
	 * @param pageable thông tin phân trang
	 * @return danh sách comment theo comic và trạng thái với phân trang
	 */
	Page<Comment> findByComicIdAndStatus(String comicId, CommentStatus status, Pageable pageable);

	/**
	 * Tìm comment theo chapter id
	 * @param chapterId id của chapter
	 * @param pageable thông tin phân trang
	 * @return danh sách comment theo chapter với phân trang
	 */
	Page<Comment> findByChapterId(String chapterId, Pageable pageable);

	/**
	 * Tìm comment theo chapter id và trạng thái
	 * @param chapterId id của chapter
	 * @param status trạng thái comment
	 * @param pageable thông tin phân trang
	 * @return danh sách comment theo chapter và trạng thái với phân trang
	 */
	Page<Comment> findByChapterIdAndStatus(String chapterId, CommentStatus status, Pageable pageable);

	/**
	 * Tìm comment theo user id
	 * @param userId id của người dùng
	 * @param pageable thông tin phân trang
	 * @return danh sách comment của người dùng với phân trang
	 */
	Page<Comment> findByUserId(String userId, Pageable pageable);

	/**
	 * Tìm comment theo user id và trạng thái
	 * @param userId id của người dùng
	 * @param status trạng thái comment
	 * @param pageable thông tin phân trang
	 * @return danh sách comment của người dùng theo trạng thái với phân trang
	 */
	Page<Comment> findByUserIdAndStatus(String userId, CommentStatus status, Pageable pageable);

	/**
	 * Tìm comment cha (parent comment là null) theo comic
	 * @param comicId id của comic
	 * @param pageable thông tin phân trang
	 * @return danh sách comment cha theo comic với phân trang
	 */
	Page<Comment> findByComicIdAndParentIsNull(String comicId, Pageable pageable);

	/**
	 * Tìm comment cha theo comic và trạng thái
	 * @param comicId id của comic
	 * @param status trạng thái comment
	 * @param pageable thông tin phân trang
	 * @return danh sách comment cha theo comic và trạng thái với phân trang
	 */
	Page<Comment> findByComicIdAndParentIsNullAndStatus(String comicId, CommentStatus status, Pageable pageable);

	/**
	 * Tìm reply comment (comment con) theo parent id
	 * @param parentId id của comment cha
	 * @param status trạng thái comment
	 * @return danh sách comment con theo comment cha và trạng thái
	 */
	List<Comment> findByParentIdAndStatus(String parentId, CommentStatus status);

	/**
	 * Tìm comment theo trạng thái
	 * @param status trạng thái comment
	 * @param pageable thông tin phân trang
	 * @return danh sách comment theo trạng thái với phân trang
	 */
	Page<Comment> findByStatus(CommentStatus status, Pageable pageable);

	/**
	 * Đếm số comment theo comic id
	 * @param comicId id của comic
	 * @return tổng số comment của comic
	 */
	long countByComicId(String comicId);

	/**
	 * Đếm số comment theo comic id và trạng thái
	 * @param comicId id của comic
	 * @param status trạng thái comment
	 * @return tổng số comment của comic theo trạng thái
	 */
	long countByComicIdAndStatus(String comicId, CommentStatus status);

	/**
	 * Đếm số comment theo chapter id
	 * @param chapterId id của chapter
	 * @return tổng số comment của chapter
	 */
	long countByChapterId(String chapterId);

	/**
	 * Đếm số comment theo chapter id và trạng thái
	 * @param chapterId id của chapter
	 * @param status trạng thái comment
	 * @return tổng số comment của chapter theo trạng thái
	 */
	long countByChapterIdAndStatus(String chapterId, CommentStatus status);

	/**
	 * Đếm số reply cho một comment
	 * @param parentId id của comment cha
	 * @param status trạng thái comment
	 * @return tổng số comment con của comment cha theo trạng thái
	 */
	long countByParentIdAndStatus(String parentId, CommentStatus status);

	/**
	 * Tìm comment theo nhiều tiêu chí với câu truy vấn tùy chỉnh
	 * @param comicId id của comic (có thể null)
	 * @param chapterId id của chapter (có thể null)
	 * @param userId id của người dùng (có thể null)
	 * @param status trạng thái comment (có thể null)
	 * @param content nội dung tìm kiếm (có thể null)
	 * @param pageable thông tin phân trang
	 * @return danh sách comment phù hợp với các tiêu chí với phân trang
	 */
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