package com.thjvjpxx.backend_comic.model;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.thjvjpxx.backend_comic.enums.ChapterStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity(name = "chapters")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Table(indexes = {
        // Index cho JOIN với comic_id (INNER JOIN chapters ch ON c.id = ch.comic_id)
        @Index(name = "idx_chapter_comic_id", columnList = "comic_id"),
        // Index cho MAX(ch.chapter_number) trong findTopComicsByStartAndEndDate
        @Index(name = "idx_chapter_comic_number", columnList = "comic_id, chapter_number"),
        // Index cho MAX(ch.updated_at) trong findLastUpdateComics
        @Index(name = "idx_chapter_comic_updated", columnList = "comic_id, updated_at"),
        // Index cho sắp xếp theo updated_at DESC
        @Index(name = "idx_chapter_updated_at", columnList = "updated_at")
})
public class Chapter {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    String id;

    String title;

    @Column(name = "domain_cdn")
    String domainCdn;

    @Column(name = "chapter_path")
    String chapterPath;

    @Column(name = "chapter_number")
    Double chapterNumber;

    @Column(name = "price")
    Double price; // Giá chapter tính bằng linh thạch

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ChapterStatus status;

    @ManyToOne
    @JoinColumn(name = "comic_id", nullable = false)
    @JsonIgnore
    Comic comic;

    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL, orphanRemoval = true)
    List<DetailChapter> detailChapters;

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDateTime updatedAt;
}
