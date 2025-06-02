package com.thjvjpxx.backend_comic.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.model.Comic;

@Repository
public interface ComicRepository extends JpaRepository<Comic, String> {

    Optional<Comic> findBySlug(String slug);

    Page<Comic> findAll(Pageable pageable);

    Page<Comic> findBySlugContainingOrNameContaining(String slug, String name, Pageable pageable);

    Page<Comic> findByStatus(ComicStatus status, Pageable pageable);

    @Query("SELECT c FROM comics c JOIN c.categories cat WHERE cat.id = :categoryId")
    Page<Comic> findByCategory(@Param("categoryId") String category, Pageable pageable);

    Page<Comic> findByUpdatedAtAfter(LocalDateTime date, Pageable pageable);

}
