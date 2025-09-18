package com.mango.backend.domain.paymenthistory.service;

import com.mango.backend.domain.even.UserSignUpEvent;
import com.mango.backend.domain.paymenthistory.dto.PaymentApiResponse;
import com.mango.backend.domain.paymenthistory.dto.PaymentHistoryDto;
import com.mango.backend.domain.paymenthistory.entity.PaymentHistory;
import com.mango.backend.domain.paymenthistory.repository.PaymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PaymentHistoryService {

    private final PaymentHistoryRepository paymentHistoryRepository;
    private final RestClient restClient = RestClient.builder()
            .baseUrl("http://localhost:8000")
            .defaultHeader("Content-Type", "application/json")
            .build();

    @Transactional
    public PaymentHistory savePaymentFromDto(PaymentHistoryDto dto) {
        PaymentHistory payment = PaymentHistory.from(dto);
        return paymentHistoryRepository.save(payment);
    }

    @EventListener
    @Transactional
    @Async
    public void handleUserSignUp(UserSignUpEvent event) {
        try {
            log.info("회원가입 이벤트 수신 - 사용자 ID: {}, 성별: {}, 생년월일: {}",
                    event.userId(), event.gender(), event.birthDate());

            // 외부 API 호출
            List<PaymentHistoryDto> apiResponse = callPaymentApi(event);

            // 받은 데이터를 savePaymentFromDto로 저장
            List<PaymentHistory> savedPayments = apiResponse.stream()
                    .map(this::savePaymentFromDto)
                    .toList();

            log.info("회원가입 후처리 완료 - 사용자 ID: {}, 저장된 결제 데이터: {}개",
                    event.userId(), savedPayments.size());

        } catch (Exception e) {
            log.error("회원가입 후처리 실패 - 사용자 ID: {}", event.userId(), e);
        }
    }

    private List<PaymentHistoryDto> callPaymentApi(UserSignUpEvent event) {
        try {
            String uri = UriComponentsBuilder.fromPath("/ai-api/v1/payments")
                    .queryParam("gender", event.gender())
                    .queryParam("user_id", event.userId())
                    .queryParam("birthdate", event.birthDate().toString())
                    .queryParam("months", 6)
                    .toUriString();

            log.info("마이데이터 API 호출: {}", uri);

            PaymentApiResponse response = restClient.post()
                    .uri(uri)
                    .retrieve()
                    .body(PaymentApiResponse.class);

            if (response != null && response.payments() != null) {
                log.info("마이데이터 API 응답 수신 - 결제 데이터 개수: {}", response.payments().size());
                return response.payments();
            }

            return new ArrayList<>();

        } catch (Exception e) {
            log.error("마이데이터 API 호출 실패 - 사용자 ID: {}", event.userId(), e);
            return new ArrayList<>();
        }
    }
}