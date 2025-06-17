package com.thjvjpxx.backend_comic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.ReadingHistory;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface ReadingHistoryRepository extends JpaRepository<ReadingHistory, String> {

    /**
     * Tìm reading history theo user và chapter
     * 
     * @param user    User
     * @param chapter Chapter
     * @return ReadingHistory
     */
    Optional<ReadingHistory> findByUserAndChapter(User user, Chapter chapter);

    /**
     * Tìm reading history theo comicId
     * 
     * @param comicId ComicId
     * @return List<ReadingHistory>
     */
    @Query("SELECT rh FROM reading_histories rh join rh.chapter c WHERE c.comic.id = :comicId")
    List<ReadingHistory> findByComicId(String comicId);
}
