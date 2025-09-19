package com.mango.backend.domain.consumptionpattern.service;

import com.mango.backend.domain.consumptionpattern.dto.request.ConsumptionPatternApiRequest;
import com.mango.backend.domain.consumptionpattern.dto.response.ConsumptionPatternApiResponse;
import com.mango.backend.domain.consumptionpattern.entity.ConsumptionPattern;
import com.mango.backend.domain.consumptionpattern.entity.FoodItem;
import com.mango.backend.domain.consumptionpattern.entity.KeywordItem;
import com.mango.backend.domain.consumptionpattern.entity.TypeItem;
import com.mango.backend.domain.consumptionpattern.repository.ConsumptionPatternRepository;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ConsumptionPatternService {
    private final ConsumptionPatternRepository consumptionPatternRepository;
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
    public ServiceResult<Void> analysisPaymentData(Long userId) {
        try {
            log.info("분석 시작  - 사용자 ID: {}", userId);

            // 사용자 정보 조회


            userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));

            List<PaymentHistoryDto> payments = new ArrayList<>();
            List<PaymentHistory> paymentHistories = paymentHistoryRepository.findByUserIdAndPaymentTimeBetween(
                    userId, LocalDateTime.now().minusMonths(3), LocalDateTime.now());

            if (paymentHistories.isEmpty()) {
                log.warn("분석할 결제 데이터가 없습니다 - 사용자 ID: {}", userId);
                return ServiceResult.failure(ErrorCode.NO_PAYMENT_DATA); // 적절한 에러코드로 변경
            }

            // 시작/종료 시간 계산
            LocalDateTime startDate = paymentHistories.stream()
                    .map(PaymentHistory::getPaymentTime)
                    .min(LocalDateTime::compareTo)
                    .orElse(LocalDateTime.now().minusMonths(3));

            LocalDateTime endDate = paymentHistories.stream()
                    .map(PaymentHistory::getPaymentTime)
                    .max(LocalDateTime::compareTo)
                    .orElse(LocalDateTime.now());

            for(PaymentHistory paymentHistory : paymentHistories) {
                payments.add(PaymentHistoryDto.from(paymentHistory));
            }
            // 외부 API 호출
            ConsumptionPatternApiResponse apiResponse = callExternalAnalysisPaymentApi(payments);
            log.info("apiResponse: {}", apiResponse);

            // ConsumptionPattern 엔티티로 변환 및 저장
            ConsumptionPattern consumptionPattern = convertToEntity(apiResponse, userId, startDate, endDate);
            ConsumptionPattern savedPattern = consumptionPatternRepository.save(consumptionPattern);

            return ServiceResult.success(null);

        } catch (Exception e) {
            log.error("외부 결제 데이터 조회/저장 실패 - 사용자 ID: {}", userId, e);
            return ServiceResult.failure(ErrorCode.SERVER_ERROR);
        }
    }

    private ConsumptionPatternApiResponse callExternalAnalysisPaymentApi(List<PaymentHistoryDto> payments) {
        try {
            RestClient restClient = createRestClient();
            String uri = UriComponentsBuilder.fromPath("/ai-api/v1/profile/cosine")
                    .toUriString();

            ConsumptionPatternApiRequest request = new ConsumptionPatternApiRequest();
            request.setPayments(payments);

            ConsumptionPatternApiResponse response = restClient.post()
                    .uri(uri)
                    .body(request)
                    .retrieve()
                    .body(ConsumptionPatternApiResponse.class);
            if (response == null) {
                throw new RuntimeException("외부 API 응답이 null입니다");
            }
            if (response.getMainType() != null ||
                response.getKeyword() != null ||
                response.getFoods() != null) {
                log.info("외부 API 응답 수신 - main_type 개수: {}, keyword 개수: {}, foods 개수: {}",
                        response.getMainType().size(),
                        response.getKeyword().size(),
                        response.getFoods().size());
            }
            return response;
        } catch (Exception e) {
            throw new RuntimeException("외부 API 호출 실패", e);
        }
    }
    private ConsumptionPattern convertToEntity(ConsumptionPatternApiResponse apiResponse,
                                               Long userId,
                                               LocalDateTime startDate,
                                               LocalDateTime endDate) {

        // TypeItem 변환
        List<TypeItem> mainTypes = apiResponse.getMainType().stream()
                .map(type -> TypeItem.builder()
                        .name(type.getName())
                        .prob(type.getProb())
                        .build())
                .toList();

        // KeywordItem 변환
        List<KeywordItem> keywords = apiResponse.getKeyword().stream()
                .map(keyword -> KeywordItem.builder()
                        .name(keyword.getName())
                        .score(keyword.getScore())
                        .build())
                .toList();

        // FoodItem 변환
        List<FoodItem> foods = apiResponse.getFoods().stream()
                .map(food -> FoodItem.builder()
                        .name(food.getName())
                        .score(food.getScore())
                        .build())
                .toList();

        return ConsumptionPattern.builder()
                .userId(userId)
                .mainType(mainTypes)
                .keyword(keywords)
                .food(foods)
                .startDate(startDate)
                .endDate(endDate)
                .build();
    }
}