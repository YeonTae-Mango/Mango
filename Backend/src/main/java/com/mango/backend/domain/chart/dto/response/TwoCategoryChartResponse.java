package com.mango.backend.domain.chart.dto.response;

import lombok.Builder;

import java.util.Map;

@Builder
public record TwoCategoryChartResponse(
        String[] labels,
        Integer[] myData,
        Integer[] partnerData,
        Map<String, String> myHighest,
        Map<String, String> otherHighest
) {
}