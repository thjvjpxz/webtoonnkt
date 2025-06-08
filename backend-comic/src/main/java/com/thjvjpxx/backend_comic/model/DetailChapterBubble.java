package com.thjvjpxx.backend_comic.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
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
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Entity(name = "detail_chapter_bubbles")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(indexes = {
        @Index(name = "idx_detail_chapter_id", columnList = "detail_chapter_id"),
        @Index(name = "idx_bubble_order", columnList = "bubble_order"),
})
public class DetailChapterBubble {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    String id;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "detail_chapter_id")
    DetailChapter detailChapter;

    @Column(name = "pos_x")
    int posX;

    @Column(name = "pos_y")
    int posY;

    @Column(name = "width")
    int width;

    @Column(name = "height")
    int height;

    @Column(name = "bubble_order")
    int bubbleOrder;

    @Column(name = "text_content", columnDefinition = "TEXT")
    String textContent;

    @Column(name = "mp3_url")
    String mp3Url;

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDateTime updatedAt;
}
