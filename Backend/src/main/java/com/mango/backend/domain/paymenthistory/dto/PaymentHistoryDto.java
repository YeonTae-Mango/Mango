package com.mango.backend.domain.paymenthistory.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
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
}
