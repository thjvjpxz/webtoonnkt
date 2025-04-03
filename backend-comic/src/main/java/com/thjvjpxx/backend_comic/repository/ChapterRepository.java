package com.thjvjpxx.backend_comic.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Chapter;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, String> {

    Page<Chapter> findAll(Pageable pageable);

    Page<Chapter> findByTitleContaining(String title, Pageable pageable);

    Page<Chapter> findByComicId(String comicId, Pageable pageable);

    Page<Chapter> findByComicIdAndTitleContaining(String comicId, String title, Pageable pageable);

    Page<Chapter> findByComicIdAndStatus(String comicId, String status, Pageable pageable);
}
