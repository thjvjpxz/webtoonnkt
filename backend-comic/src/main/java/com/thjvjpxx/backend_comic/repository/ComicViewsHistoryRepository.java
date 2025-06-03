package com.thjvjpxx.backend_comic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thjvjpxx.backend_comic.model.ComicViewsHistory;

public interface ComicViewsHistoryRepository extends JpaRepository<ComicViewsHistory, String> {
}
