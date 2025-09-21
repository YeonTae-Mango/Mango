package com.mango.backend.domain.chart.dto.response;

public record MyThisMonthChartResponse(
        Long[] lastMonth,
        Long[] thisMonthRaw,
        int todayIndex
) {
}
