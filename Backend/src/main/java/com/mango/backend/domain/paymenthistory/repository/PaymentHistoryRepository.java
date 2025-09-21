package com.mango.backend.domain.paymenthistory.repository;

import com.mango.backend.domain.paymenthistory.entity.PaymentHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentHistoryRepository extends MongoRepository<PaymentHistory,String> {
    List<PaymentHistory> findByUserIdAndPaymentTimeBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
}
