package com.thjvjpxx.backend_comic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.DetailChapter;

@Repository
public interface DetailChapterRepository extends JpaRepository<DetailChapter, String> {

}
