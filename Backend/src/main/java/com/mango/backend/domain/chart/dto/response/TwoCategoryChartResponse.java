package com.mango.backend.domain.chart.dto.response;

import lombok.Builder;

@Builder
public record TwoCategoryChartResponse(
        String[] labels,
        Integer[] myData,
        Integer[] partnerData
) {
}