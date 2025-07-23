package com.thjvjpxx.backend_comic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.ReadingHistory;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface ReadingHistoryRepository extends JpaRepository<ReadingHistory, String> {

    /**
     * Tìm lịch sử đọc theo user và chapter
     * 
     * @param user    User
     * @param chapter Chapter
     * @return ReadingHistory
     */
    Optional<ReadingHistory> findByUserAndChapter(User user, Chapter chapter);

    /**
     * Tìm lịch sử đọc theo comicId
     * 
     * @param comicId ComicId
     * @return List<ReadingHistory>
     */
    @Query("SELECT rh FROM reading_histories rh join rh.chapter c WHERE c.comic.id = :comicId")
    List<ReadingHistory> findByComicId(String comicId);

    /**
     * Tìm lịch sử đọc theo user và lấy distinct comic (mỗi comic chỉ xuất hiện 1
     * lần)
     * Sắp xếp theo thời gian đọc gần nhất
     * 
     * @param userId   ID user
     * @param pageable Pageable
     * @return Page<ReadingHistory>
     */
    @Query(value = """
            SELECT rh.* FROM reading_histories rh
            INNER JOIN chapters c ON rh.chapter_id = c.id
            INNER JOIN (
                SELECT c2.comic_id, MAX(rh2.updated_at) as max_updated_at
                FROM reading_histories rh2
                INNER JOIN chapters c2 ON rh2.chapter_id = c2.id
                WHERE rh2.user_id = :userId
                GROUP BY c2.comic_id
            ) latest ON c.comic_id = latest.comic_id AND rh.updated_at = latest.max_updated_at
            WHERE rh.user_id = :userId
            ORDER BY rh.updated_at DESC
            """, countQuery = """
            SELECT COUNT(DISTINCT c.comic_id)
            FROM reading_histories rh
            INNER JOIN chapters c ON rh.chapter_id = c.id
            WHERE rh.user_id = :userId
            """, nativeQuery = true)
    Page<ReadingHistory> findDistinctComicsByUserId(String userId, Pageable pageable);

    /**
     * Tìm chapter number lớn nhất đã đọc của user cho một comic cụ thể
     * 
     * @param userId  ID user
     * @param comicId ID comic
     * @return Chapter number lớn nhất đã đọc
     */
    @Query("SELECT MAX(c.chapterNumber) FROM reading_histories rh " +
            "JOIN rh.chapter c " +
            "WHERE rh.user.id = :userId AND c.comic.id = :comicId")
    Double findMaxChapterNumberReadByUserAndComic(String userId, String comicId);
}
