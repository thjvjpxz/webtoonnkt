package com.thjvjpxx.backend_comic.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.enums.WithdrawalStatus;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.WithdrawalRequest;

@Repository
public interface WithdrawalRequestRepository extends JpaRepository<WithdrawalRequest, String> {

    // Tìm yêu cầu rút tiền theo publisher
    Page<WithdrawalRequest> findByPublisher(User publisher, Pageable pageable);

    // Tìm yêu cầu rút tiền theo status
    Page<WithdrawalRequest> findByStatus(WithdrawalStatus status, Pageable pageable);

    // Tìm yêu cầu rút tiền của publisher theo status
    List<WithdrawalRequest> findByPublisherAndStatus(User publisher, WithdrawalStatus status);

    // Tính tổng số tiền đang chờ rút của publisher
    @Query("SELECT COALESCE(SUM(wr.amount), 0) FROM withdrawal_requests wr WHERE wr.publisher = :publisher AND wr.status = 'PENDING'")
    Double getTotalPendingAmountByPublisher(@Param("publisher") User publisher);

    // Tính tổng số tiền đã rút thành công của publisher
    @Query("SELECT COALESCE(SUM(wr.amount), 0) FROM withdrawal_requests wr WHERE wr.publisher = :publisher AND wr.status = 'COMPLETED'")
    Double getTotalWithdrawnAmountByPublisher(@Param("publisher") User publisher);

    // Kiểm tra publisher có yêu cầu rút tiền đang pending không
    boolean existsByPublisherAndStatus(User publisher, WithdrawalStatus status);
}