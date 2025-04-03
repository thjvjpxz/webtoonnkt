package com.thjvjpxx.backend_comic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.LevelType;

@Repository
public interface LevelTypeRepository extends JpaRepository<LevelType, String> {
    Optional<LevelType> findByName(String name);
}
