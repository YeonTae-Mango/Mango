package com.mango.backend.domain.chart.controller;

import com.mango.backend.domain.chart.service.ChartService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/chart")
public class ChartController extends BaseController {
    private final ChartService chartService;

    @GetMapping("myCategoryChart/{userId}")
    public ResponseEntity<BaseResponse> getMyCategoryChart(
        @PathVariable Long userId
    ){
        return toResponseEntity(chartService.getMyCategoryChart(userId), "내 카테고리 차트 조회에 성공하였습니다.");
    }
    @GetMapping("myMonthlyChart/{userId}")
    public ResponseEntity<BaseResponse> getMyMonthlyChart(
            @PathVariable Long userId
    ){
        return toResponseEntity(chartService.getMyMonthlyChart(userId), "내 이번달 결제 차트 조회에 성공하였습니다.");
    }
}
