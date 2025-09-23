package com.mango.backend.domain.chart.dto.response;

public record TwoTimeChartResponse(
        int[] myData,
        int[] yourData,
        String[] timeLabels,
        String[] hotTime
) {
}
