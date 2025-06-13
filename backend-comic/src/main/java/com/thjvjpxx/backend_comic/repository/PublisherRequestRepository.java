package com.thjvjpxx.backend_comic.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.enums.PublisherRequestStatus;
import com.thjvjpxx.backend_comic.model.PublisherRequest;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface PublisherRequestRepository extends JpaRepository<PublisherRequest, String> {
    Optional<PublisherRequest> findByUser(User user);

    Page<PublisherRequest> findByStatus(PublisherRequestStatus status, Pageable pageable);

    Page<PublisherRequest> findByStatusAndUserUsernameContaining(PublisherRequestStatus status, String username,
            Pageable pageable);

    Page<PublisherRequest> findByUserUsernameContaining(String username, Pageable pageable);
}
