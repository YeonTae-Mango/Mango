package com.mango.backend.domain.chart.dto.response;

import lombok.Builder;

import java.util.Map;

@Builder
public record MyCategoryChartResponse(
        String[] labels,
        Long[] data,
        Integer[] weight,
        String total,
        Map<String, String> highest
) {
}
