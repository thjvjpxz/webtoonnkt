package com.thjvjpxx.backend_comic.model;

import java.time.LocalDateTime;
import java.util.List;

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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity(name = "comics")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(indexes = {
        @Index(name = "idx_comic_name", columnList = "name"),
        @Index(name = "idx_comic_status", columnList = "status"),
        @Index(name = "idx_comic_views_count", columnList = "views_count"),
        @Index(name = "idx_comic_updated_at", columnList = "updated_at"),
        @Index(name = "idx_comic_views_updated", columnList = "views_count, updated_at"),
        @Index(name = "idx_comic_slug_name", columnList = "slug, name"),
        @Index(name = "idx_comic_publisher", columnList = "publisher_id")
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
    @Builder.Default
    int followersCount = 0;

    @Column(name = "views_count")
    @Builder.Default
    int viewsCount = 0;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    @JsonIgnore
    User publisher;

    @ManyToMany(cascade = { CascadeType.REMOVE }, fetch = FetchType.EAGER)
    @JoinTable(name = "comic_categories", joinColumns = @JoinColumn(name = "comic_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    List<Category> categories;

    @OneToMany(mappedBy = "comic", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    List<Chapter> chapters;

    @OneToMany(mappedBy = "comic", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    List<Comment> comments;

    @OneToMany(mappedBy = "comic", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    List<UserFollow> userFollows;

    @OneToMany(mappedBy = "comic", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    List<ComicViewsHistory> comicViewsHistories;

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDateTime updatedAt;

    public void addCategories(List<Category> categories) {
        this.categories.addAll(categories);
    }

    public void removeCategories(List<Category> categories) {
        this.categories.removeAll(categories);
    }

    public boolean belongsToPublisher(User user) {
        if (this.publisher == null) {
            return false;
        }
        return this.publisher.getId().equals(user.getId());
    }
}
