package com.thjvjpxx.backend_comic.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Level;

@Repository
public interface LevelRepository extends JpaRepository<Level, String> {
    boolean existsByName(String name);

    Page<Level> findAll(Pageable pageable);

    Page<Level> findByNameContaining(String name, Pageable pageable);

    Optional<Level> findByName(String name);
}
