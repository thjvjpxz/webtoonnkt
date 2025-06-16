package com.thjvjpxx.backend_comic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.dto.response.HomeResponse.ChapterHome;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, String> {

	/**
	 * Tìm tất cả chapter
	 * 
	 * @param pageable Pageable
	 * @return Page<Chapter>
	 */
	Page<Chapter> findAll(Pageable pageable);

	/**
	 * Tìm chapter theo title
	 * 
	 * @param title    Title
	 * @param pageable Pageable
	 * @return Page<Chapter>
	 */
	Page<Chapter> findByTitleContaining(String title, Pageable pageable);

	/**
	 * Tìm chapter theo comicId
	 * 
	 * @param comicId  ComicId
	 * @param pageable Pageable
	 * @return Page<Chapter>
	 */
	Page<Chapter> findByComicId(String comicId, Pageable pageable);

	/**
	 * Tìm chapter theo comicId và title
	 * 
	 * @param comicId  ComicId
	 * @param title    Title
	 * @param pageable Pageable
	 * @return Page<Chapter>
	 */
	Page<Chapter> findByComicIdAndTitleContaining(String comicId, String title, Pageable pageable);

	/**
	 * Tìm chapter theo comicId và status
	 * 
	 * @param comicId  ComicId
	 * @param status   Status
	 * @param pageable Pageable
	 * @return Page<Chapter>
	 */
	Page<Chapter> findByComicIdAndStatus(String comicId, String status, Pageable pageable);

	List<Chapter> findByComicId(String comicId);

	/**
	 * Tìm chapter theo title và comicId với pageable và LIKE %:title%
	 * 
	 * @param title    Title
	 * @param comicId  ComicId
	 * @param pageable Pageable
	 * @return Page<Chapter>
	 */
	@Query("SELECT c FROM chapters c JOIN c.comic com WHERE com.id = :comicId AND c.title LIKE %:title%")
	Page<Chapter> findByTitleContainingAndComicId(@Param("title") String title, @Param("comicId") String comicId,
			Pageable pageable);

	/**
	 * Tìm chapter theo comicId và chapterNumber
	 * 
	 * @param comicId       ComicId
	 * @param chapterNumber ChapterNumber
	 * @return Optional<Chapter>
	 */
	@Query("SELECT c FROM chapters c WHERE c.comic.id = :comicId AND c.chapterNumber = :chapterNumber")
	Optional<Chapter> findByComicIdAndChapterNumber(@Param("comicId") String comicId,
			@Param("chapterNumber") double chapterNumber);

	/**
	 * Tìm chapter theo chapterNumber và comicId (loại trừ chapter có id cụ thể)
	 * Sử dụng để kiểm tra trùng lặp chapterNumber khi cập nhật chapter
	 * 
	 * @param chapterNumber Số thứ tự chapter cần kiểm tra
	 * @param comicId       ID của comic chứa chapter
	 * @param id            ID của chapter cần loại trừ khỏi kết quả tìm kiếm
	 * @return Optional<Chapter> Chapter tìm được hoặc empty nếu không tìm thấy
	 */
	@Query("SELECT c FROM chapters c JOIN c.comic com WHERE com.id = :comicId AND c.chapterNumber = :chapterNumber AND c.id != :id")
	Optional<Chapter> findByChapterNumberAndComicId(@Param("chapterNumber") double chapterNumber,
			@Param("comicId") String comicId, @Param("id") String id);

	/**
	 * Tìm chapter có chapterNumber lớn nhất theo comicId
	 * 
	 * @param comicId ComicId
	 * @return Double
	 */
	@Query("SELECT MAX(c.chapterNumber) FROM chapters c WHERE c.comic.id = :comicId")
	Double findMaxChapterNumberByComicId(@Param("comicId") String comicId);

	/**
	 * Tìm 4 chapter mới nhất theo comicId
	 * 
	 * @param comicId ComicId
	 * @return List<ChapterHome>
	 */
	@Query(value = """
			SELECT
				c.id,
				c.domain_cdn,
				c.chapter_path,
				c.status,
				c.price,
				c.chapter_number,
				c.updated_at

			FROM
				chapters c
			WHERE
				c.comic_id = :comicId
			ORDER BY
				c.updated_at DESC, c.chapter_number DESC
			LIMIT 4
			""", nativeQuery = true)
	List<ChapterHome> findTop4LatestChapter(@Param("comicId") String comicId);

	/**
	 * Kiểm tra chapter có tồn tại theo comic và chapterNumber
	 * 
	 * @param comic         Comic
	 * @param chapterNumber ChapterNumber
	 * @return boolean
	 */
	boolean existsByComicAndChapterNumber(Comic comic, Double chapterNumber);

	// === QUERIES CHO ADMIN STATISTICS ===

	/**
	 * Đếm tổng số chapter
	 * 
	 * @return Long
	 */
	@Query("SELECT COUNT(ch) FROM chapters ch")
	Long countTotalChapters();
}
