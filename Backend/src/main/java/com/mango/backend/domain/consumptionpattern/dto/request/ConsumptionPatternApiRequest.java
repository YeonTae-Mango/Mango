
package com.mango.backend.domain.consumptionpattern.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mango.backend.domain.paymenthistory.dto.PaymentHistoryDto;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class ConsumptionPatternApiRequest {
    @JsonProperty("payments")
    private List<PaymentHistoryDto> payments;
}