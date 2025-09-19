package com.mango.backend.domain.consumptionpattern.controller;

import com.mango.backend.domain.consumptionpattern.service.ConsumptionPatternService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/consumption-pattern")
@RequiredArgsConstructor
public class ConsumptionPatternController extends BaseController {

    private final ConsumptionPatternService consumptionPatternService;

    @PostMapping("/fetch-external/{userId}")
    public ResponseEntity<BaseResponse> fetchExternalPaymentData(
            @PathVariable Long userId) {
        log.info("소비패턴 분석 요청 - 사용자 ID: {}", userId);
        return toResponseEntity(consumptionPatternService.analysisPaymentData(userId), "소비패턴 분석에 성공하였습니다");
    }
}
