package com.mango.backend.domain.paymenthistory.controller;

import com.mango.backend.domain.paymenthistory.entity.PaymentHistory;
import com.mango.backend.domain.paymenthistory.service.PaymentHistoryService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.common.api.BaseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payment-history")
@RequiredArgsConstructor
@Slf4j
public class PaymentHistoryController extends BaseController {

    private final PaymentHistoryService paymentHistoryService;

    @PostMapping("/fetch-external/{userId}")
    public ResponseEntity<BaseResponse> fetchExternalPaymentData(
            @PathVariable Long userId)
 {

        log.info("외부 결제 데이터 수동 조회 요청 - 사용자 ID: {}",
                userId);

        return toResponseEntity(paymentHistoryService.fetchAndSaveExternalPaymentData(userId), "결제내역 생성에 성공하였습니다.");
    }
}
