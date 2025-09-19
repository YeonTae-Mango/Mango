package com.mango.backend.domain.paymenthistory.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mango.backend.domain.paymenthistory.entity.PaymentHistory;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@Builder
public class PaymentHistoryDto {
    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("payment_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime paymentTime;

    @JsonProperty("category")
    private String category;

    @JsonProperty("subcategory")
    private String subcategory;

    @JsonProperty("payment_id")
    private String externalPaymentId;

    @JsonProperty("payment_amount")
    private Long paymentAmount;

    public static PaymentHistoryDto from(PaymentHistory  paymentHistory) {
        return PaymentHistoryDto.builder()
                .userId(paymentHistory.getUserId())
                .paymentTime(paymentHistory.getPaymentTime())
                .category(paymentHistory.getCategory())
                .subcategory(paymentHistory.getSubcategory())
                .externalPaymentId(paymentHistory.getExternalPaymentId())
                .paymentAmount(paymentHistory.getPaymentAmount())
                .build();
    }
}
