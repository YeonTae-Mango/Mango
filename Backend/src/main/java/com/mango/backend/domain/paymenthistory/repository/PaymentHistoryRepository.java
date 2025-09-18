package com.mango.backend.domain.paymenthistory.repository;

import com.mango.backend.domain.paymenthistory.entity.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory,Long> {
    List<PaymentHistory> findByUserIdAndPaymentDateBetween(Long userId, Instant startDate, Instant endDate);
}
