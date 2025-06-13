package com.thjvjpxx.backend_comic.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.UserFollow;

@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, String> {
    Optional<UserFollow> findByUserIdAndComicId(String userId, String comicId);

    Page<UserFollow> findByUserId(String userId, Pageable pageable);

    // Đếm tổng số follow của publisher
    @Query("SELECT COUNT(uf) FROM UserFollow uf WHERE uf.comic.publisher = :publisher")
    Long countTotalFollowersByPublisher(@Param("publisher") User publisher);

    // Đếm số follow theo comic
    Long countByComic(Comic comic);

    // Đếm số follow mới trong khoảng thời gian
    @Query("SELECT COUNT(uf) FROM UserFollow uf WHERE uf.comic.publisher = :publisher AND uf.createdAt >= :startDate AND uf.createdAt < :endDate")
    Long countFollowersByPublisherBetweenDates(@Param("publisher") User publisher,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Lấy thống kê follow theo tháng cho publisher
    @Query(value = """
            SELECT
                DATE_FORMAT(uf.created_at, '%Y-%m') as month,
                COUNT(*) as followCount
            FROM user_follows uf
            INNER JOIN comics c ON uf.comic_id = c.id
            WHERE c.publisher_id = :publisherId
                AND uf.created_at >= :startDate
                AND uf.created_at < :endDate
            GROUP BY DATE_FORMAT(uf.created_at, '%Y-%m')
            ORDER BY month DESC
            """, nativeQuery = true)
    List<Object[]> getMonthlyFollowsByPublisher(@Param("publisherId") String publisherId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Lấy top comics theo số follow của publisher
    @Query("""
            SELECT uf.comic, COUNT(uf) as followCount
            FROM UserFollow uf
            WHERE uf.comic.publisher = :publisher
            GROUP BY uf.comic
            ORDER BY followCount DESC
            """)
    List<Object[]> getTopComicsByFollowCount(@Param("publisher") User publisher, Pageable pageable);
}
