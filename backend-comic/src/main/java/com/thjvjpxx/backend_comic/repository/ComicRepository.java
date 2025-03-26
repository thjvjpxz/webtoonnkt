package com.thjvjpxx.backend_comic.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Comic;

@Repository
public interface ComicRepository extends JpaRepository<Comic, String> {

    Optional<Comic> findBySlug(String slug);

    Page<Comic> findAll(Pageable pageable);

    Page<Comic> findBySlugContainingOrNameContaining(String slug, String name, Pageable pageable);
}
