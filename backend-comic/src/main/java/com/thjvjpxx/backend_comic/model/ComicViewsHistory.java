package com.thjvjpxx.backend_comic.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity(name = "comic_views_history")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(indexes = {
        // Index cho LEFT JOIN comic_views_history cvh ON c.id = cvh.comic_id
        @Index(name = "idx_comic_views_comic_id", columnList = "comic_id"),
        // Index cho WHERE DATE(view_date) BETWEEN :startDate AND :endDate
        @Index(name = "idx_comic_views_date", columnList = "view_date"),
        // Composite index cho GROUP BY comic_id và lọc theo ngày
        @Index(name = "idx_comic_views_comic_date", columnList = "comic_id, view_date"),
        // Index cho tối ưu hóa SUM(view_count)
        @Index(name = "idx_comic_views_count", columnList = "comic_id, view_count")
})
public class ComicViewsHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    String id;

    @ManyToOne
    @JoinColumn(name = "comic_id", nullable = false)
    Comic comic;

    @Column(name = "view_date", nullable = false)
    LocalDateTime viewDate;

    @Column(name = "view_count", nullable = false)
    int viewCount;

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;
}
