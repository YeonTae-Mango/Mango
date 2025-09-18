package com.mango.backend.domain.paymenthistory.dto;

import lombok.Getter;

import java.util.List;

public record PaymentApiResponse(
        List<PaymentHistoryDto> payments
) {
}
