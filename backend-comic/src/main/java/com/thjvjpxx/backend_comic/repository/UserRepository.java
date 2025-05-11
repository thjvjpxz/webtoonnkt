package com.thjvjpxx.backend_comic.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Role;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Page<User> findByUsernameContainingOrEmailContaining(String username, String email, Pageable pageable);

    Page<User> findByRole(Role role, Pageable pageable);

    @Query("SELECT u FROM users u WHERE u.role = :role AND (u.username LIKE %:searchTerm% OR u.email LIKE %:searchTerm%)")
    Page<User> findByRoleAndUsernameOrEmailContaining(@Param("role") Role role, @Param("searchTerm") String searchTerm,
            Pageable pageable);
}
