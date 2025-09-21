package com.mango.backend.domain.chart.dto.response;

public record TwoTypeChartResponse(
        String[] labels,
        int[] myData,
        int[] partnerData
) {
}
