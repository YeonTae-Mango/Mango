package com.mango.backend.domain.paymenthistory.dto.response;

import com.mango.backend.domain.paymenthistory.dto.PaymentHistoryDto;

import java.util.List;

public record PaymentApiResponse(
        List<PaymentHistoryDto> payments
) {
}
