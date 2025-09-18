package com.mango.backend.domain.chart.dto.response;

public record MyMonthlyChartResponse(
        String[] label,
        Long[] data
) {
}
