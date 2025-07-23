package com.thjvjpxx.backend_comic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.DetailChapter;

@Repository
public interface DetailChapterRepository extends JpaRepository<DetailChapter, String> {
    /**
     * Tìm các ảnh trong chapter
     * 
     * @param chapterId id của chapter
     * @return danh sách ảnh trong chapter
     */
    List<DetailChapter> findByChapterId(String chapterId);
}
