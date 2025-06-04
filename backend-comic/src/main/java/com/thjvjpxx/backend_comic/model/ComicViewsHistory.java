package com.thjvjpxx.backend_comic.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
