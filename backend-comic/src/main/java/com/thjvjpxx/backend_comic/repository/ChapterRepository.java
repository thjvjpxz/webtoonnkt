package com.thjvjpxx.backend_comic.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Chapter;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, String> {

        Page<Chapter> findAll(Pageable pageable);

        Page<Chapter> findByTitleContaining(String title, Pageable pageable);

        Page<Chapter> findByComicId(String comicId, Pageable pageable);

        Page<Chapter> findByComicIdAndTitleContaining(String comicId, String title, Pageable pageable);

        Page<Chapter> findByComicIdAndStatus(String comicId, String status, Pageable pageable);

        @Query("SELECT c FROM chapters c JOIN c.comic com WHERE com.id = :comicId AND c.title LIKE %:title%")
        Page<Chapter> findByTitleContainingAndComicId(@Param("title") String title, @Param("comicId") String comicId,
                        Pageable pageable);

        @Query("SELECT c FROM chapters c WHERE c.comic.id = :comicId AND c.chapterNumber = :chapterNumber")
        Optional<Chapter> findByComicIdAndChapterNumber(@Param("comicId") String comicId,
                        @Param("chapterNumber") double chapterNumber);

        @Query("SELECT c FROM chapters c JOIN c.comic com WHERE com.id = :comicId AND c.chapterNumber = :chapterNumber AND c.id != :id")
        Optional<Chapter> findByChapterNumberAndComicId(@Param("chapterNumber") double chapterNumber,
                        @Param("comicId") String comicId, @Param("id") String oldChapterId);

        @Query("SELECT MAX(c.chapterNumber) FROM chapters c WHERE c.comic.id = :comicId")
        Double findMaxChapterNumberByComicId(@Param("comicId") String comicId);
}
