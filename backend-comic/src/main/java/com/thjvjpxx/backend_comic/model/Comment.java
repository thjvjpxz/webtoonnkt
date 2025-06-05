package com.thjvjpxx.backend_comic.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.thjvjpxx.backend_comic.enums.CommentStatus;

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
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Entity(name = "comments")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(indexes = {
        @Index(name = "idx_comment_user_id", columnList = "user_id"),
        @Index(name = "idx_comment_chapter_id", columnList = "chapter_id"),
        @Index(name = "idx_comment_comic_id", columnList = "comic_id"),
        @Index(name = "idx_comment_parent_id", columnList = "parent_id"),
        @Index(name = "idx_comment_created_at", columnList = "created_at")
})
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false, columnDefinition = "TEXT")
    String content;

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDateTime updatedAt;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    CommentStatus status = CommentStatus.ACTIVE;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    Chapter chapter;

    @ManyToOne
    @JoinColumn(name = "comic_id", nullable = false)
    Comic comic;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    Comment parent;
}
