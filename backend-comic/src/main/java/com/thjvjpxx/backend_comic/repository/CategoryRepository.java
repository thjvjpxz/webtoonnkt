package com.thjvjpxx.backend_comic.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Page<Category> findAll(Pageable pageable);

    Page<Category> findByNameContainingOrSlugContaining(String name, String slug, Pageable pageable);

    Optional<Category> findBySlug(String slug);

    Optional<Category> findByName(String name);
}
