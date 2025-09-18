package com.mango.backend.domain.paymenthistory.dto;

import java.util.List;

public record PaymentApiResponse(
        List<PaymentHistoryDto> payments
) {
}
