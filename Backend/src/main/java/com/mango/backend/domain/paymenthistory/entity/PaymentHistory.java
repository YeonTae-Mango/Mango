package com.mango.backend.domain.paymenthistory.entity;

import com.mango.backend.domain.paymenthistory.dto.PaymentHistoryDto;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Document(collection = "payment_history")
public class PaymentHistory {
    @Id
    private String id;

    // TODO : UserId 기반으로 조회를 많이 할텐데 인덱싱하여 성능비교해볼 것
    @Field("user_id")
    private Long userId;

    @Field("payment_time")
    private LocalDateTime paymentTime;

    @Size(max = 30)
    @Field("category")
    private String category;

    @Size(max = 30)
    @Field("subcategory")
    private String subcategory;

    @Field("external_payment_id")
    private String externalPaymentId;

    @Field("payment_amount")
    private Long paymentAmount;

    public static PaymentHistory from(PaymentHistoryDto dto) {
        return PaymentHistory.builder()
                .userId(dto.getUserId())
                .paymentTime(dto.getPaymentTime())
                .category(dto.getCategory())
                .subcategory(dto.getSubcategory())
                .externalPaymentId(dto.getExternalPaymentId())
                .paymentAmount(dto.getPaymentAmount())
                .build();
    }
}