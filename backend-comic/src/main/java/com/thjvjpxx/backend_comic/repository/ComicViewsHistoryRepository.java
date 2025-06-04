package com.thjvjpxx.backend_comic.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thjvjpxx.backend_comic.model.ComicViewsHistory;

public interface ComicViewsHistoryRepository extends JpaRepository<ComicViewsHistory, String> {
    Optional<ComicViewsHistory> findByComicIdAndViewDate(String comicId, LocalDateTime viewDate);
}
