package com.thjvjpxx.backend_comic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.thjvjpxx.backend_comic.model.DetailChapter;

@Repository
public interface DetailChapterRepository extends JpaRepository<DetailChapter, String> {
    List<DetailChapter> findByChapterId(String chapterId);

    @Modifying
    @Transactional
    @Query("DELETE FROM detail_chapters d WHERE d.imgUrl = :imgUrl")
    void deleteByImgUrl(@Param("imgUrl") String imgUrl);

    @Modifying
    @Transactional
    void deleteById(String id);
}
