package com.thjvjpxx.backend_comic.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.UserFollow;

@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, String> {
    Optional<UserFollow> findByUserIdAndComicId(String userId, String comicId);

    Page<UserFollow> findByUserId(String userId, Pageable pageable);
}
