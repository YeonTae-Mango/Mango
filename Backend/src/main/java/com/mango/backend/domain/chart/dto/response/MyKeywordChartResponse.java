package com.mango.backend.domain.chart.dto.response;

public record MyKeywordChartResponse(
        String[] labels,
        int[] data
) {
}
