package com.thjvjpxx.backend_comic.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.thjvjpxx.backend_comic.enums.ComicStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Entity(name = "comics")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Table(indexes = {
        // Index cho tìm kiếm theo slug (unique đã tự động tạo index)
        // Index cho tìm kiếm theo name và slug trong
        // findBySlugContainingOrNameContaining
        @Index(name = "idx_comic_name", columnList = "name"),
        // Index cho findByStatus
        @Index(name = "idx_comic_status", columnList = "status"),
        // Index cho sắp xếp theo views_count (ORDER BY c.views_count DESC)
        @Index(name = "idx_comic_views_count", columnList = "views_count"),
        // Index cho findByUpdatedAtAfter và sắp xếp theo updated_at
        @Index(name = "idx_comic_updated_at", columnList = "updated_at"),
        // Composite index cho sắp xếp trong các truy vấn phức tạp
        @Index(name = "idx_comic_views_updated", columnList = "views_count, updated_at"),
        // Index cho tìm kiếm text search
        @Index(name = "idx_comic_slug_name", columnList = "slug, name")
})
public class Comic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    String id;

    @Column(name = "name")
    String name;

    @Column(name = "slug", unique = true)
    String slug;

    @Column(name = "origin_name")
    String originName;

    @Column(name = "thumb_url")
    String thumbUrl;

    @Column(name = "author")
    String author;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    ComicStatus status;

    @Column(name = "followers_count")
    int followersCount;

    @Column(name = "views_count")
    int viewsCount;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    @Column(name = "last_chapter_id", columnDefinition = "VARCHAR(36)")
    String lastChapterId;

    @Column(name = "folder_id", columnDefinition = "VARCHAR(50)")
    @JsonIgnore
    String folderId;

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDateTime updatedAt;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER)
    @JoinTable(name = "comic_categories", joinColumns = @JoinColumn(name = "comic_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    Set<Category> categories = new HashSet<>();

    public void addCategories(List<Category> categories) {
        this.categories.addAll(categories);
    }

    public void removeCategories(List<Category> categories) {
        this.categories.removeAll(categories);
    }

}
