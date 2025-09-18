package com.mango.backend.domain.paymenthistory.service;

import com.mango.backend.domain.even.UserSignUpEvent;
import com.mango.backend.domain.paymenthistory.dto.PaymentApiResponse;
import com.mango.backend.domain.paymenthistory.dto.PaymentHistoryDto;
import com.mango.backend.domain.paymenthistory.entity.PaymentHistory;
import com.mango.backend.domain.paymenthistory.repository.PaymentHistoryRepository;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
    private final UserRepository userRepository;

    @Value("${external.api.base-url}")
    private String externalApiBaseUrl;

    private RestClient createRestClient() {
        return RestClient.builder()
                .baseUrl(externalApiBaseUrl)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
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
                    .map(dto->{
                        dto.setUserId(event.userId());
                        return savePaymentFromDto(dto);
                    })
                    .toList();

            log.info("회원가입 후처리 완료 - 사용자 ID: {}, 저장된 결제 데이터: {}개",
                    event.userId(), savedPayments.size());

        } catch (Exception e) {
            log.error("회원가입 후처리 실패 - 사용자 ID: {}", event.userId(), e);
        }
    }
    @Transactional
    public ServiceResult<List<PaymentHistory>> fetchAndSaveExternalPaymentData(Long userId) {
        try {
            log.info("외부 결제 데이터 조회 및 저장 시작 - 사용자 ID: {}", userId);

            // 사용자 정보 조회
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));

            // 외부 API 호출
            List<PaymentHistoryDto> apiResponse = callExternalPaymentApi(
                    userId,
                    user.getGender(),
                    user.getBirthDate().toString(),
                    6
            );

            // DTO에 userId 설정 후 저장
            List<PaymentHistory> savedPayments = apiResponse.stream()
                    .map(dto -> {
                        dto.setUserId(userId);
                        return savePaymentFromDto(dto);
                    })
                    .toList();

            log.info("외부 결제 데이터 저장 완료 - 사용자 ID: {}, 저장된 개수: {}", userId, savedPayments.size());

            return ServiceResult.success(savedPayments);

        } catch (Exception e) {
            log.error("외부 결제 데이터 조회/저장 실패 - 사용자 ID: {}", userId, e);
            return ServiceResult.failure(ErrorCode.SERVER_ERROR);
        }
    }

    private List<PaymentHistoryDto> callExternalPaymentApi(Long userId, String gender, String birthDate, int months) {
        try {
            RestClient restClient = createRestClient();
            String uri = UriComponentsBuilder.fromPath("/ai-api/v1/payments")
                    .queryParam("gender", gender)
                    .queryParam("user_id", userId)
                    .queryParam("birthdate", birthDate)
                    .queryParam("months", months)
                    .toUriString();

            log.info("외부 API 호출: {}", uri);
            log.info("restClient : {}",restClient);

            PaymentApiResponse response = restClient.post()
                    .uri(uri)
                    .retrieve()
                    .body(PaymentApiResponse.class);

            if (response != null && response.payments() != null) {
                log.info("외부 API 응답 수신 - 결제 데이터 개수: {}", response.payments().size());
                return response.payments();
            }

            return new ArrayList<>();

        } catch (Exception e) {
            log.error("외부 API 호출 실패 - 사용자 ID: {}", userId, e);
            throw new RuntimeException("외부 API 호출 실패", e);
        }
    }

    private List<PaymentHistoryDto> callPaymentApi(UserSignUpEvent event) {
        try {
            RestClient restClient = createRestClient();

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