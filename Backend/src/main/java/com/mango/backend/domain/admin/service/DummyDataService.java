
package com.mango.backend.domain.admin.service;

import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Slf4j
public class DummyDataService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${server.port:8080}")
    private String serverPort;

    // 진행 상황을 저장할 Map (실제로는 Redis 등을 사용하는 것이 좋음)
    private final Map<String, DummyDataProgress> progressMap = new ConcurrentHashMap<>();

    public ServiceResult<Map<String, Object>> generateAllDummyData() {
        List<User> allUsers = userRepository.findAll();
        return processUsers(allUsers, "all-users");
    }

    public ServiceResult<Map<String, Object>> generateDummyDataFromUser(Long startUserId) {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> user.getId() >= startUserId)
                .toList();

        if (users.isEmpty()) {
            return ServiceResult.failure(ErrorCode.USER_NOT_FOUND);
        }

        return processUsers(users, "from-user-" + startUserId);
    }

    public ServiceResult<Map<String, Object>> generateDummyDataForUsers(List<Long> userIds) {
        List<User> users = userRepository.findAllById(userIds);

        if (users.isEmpty()) {
            return ServiceResult.failure(ErrorCode.USER_NOT_FOUND);
        }

        return processUsers(users, "specific-users");
    }

    private ServiceResult<Map<String, Object>> processUsers(List<User> users, String taskId) {
        log.info("더미 데이터 생성 시작: {}명의 유저", users.size());

        // 진행 상황 초기화
        DummyDataProgress progress = new DummyDataProgress();
        progress.taskId = taskId;
        progress.totalUsers = users.size();
        progress.startTime = LocalDateTime.now();
        progress.status = "RUNNING";
        progressMap.put(taskId, progress);

        // 비동기로 처리
        CompletableFuture.runAsync(() -> processUsersAsync(users, progress));

        Map<String, Object> result = new HashMap<>();
        result.put("taskId", taskId);
        result.put("totalUsers", users.size());
        result.put("message", "더미 데이터 생성이 시작되었습니다. /status로 진행상황을 확인하세요.");

        return ServiceResult.success(result);
    }

    private void processUsersAsync(List<User> users, DummyDataProgress progress) {
        String baseUrl = "http://localhost:" + serverPort;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        AtomicInteger processedCount = new AtomicInteger(0);

        for (User user : users) {
            Long userId = user.getId();

            try {
                log.info("User {} ({}) 처리 중... [{}/{}]",
                        userId, user.getNickname(),
                        processedCount.get() + 1, users.size());

                boolean paymentSuccess = false;
                boolean consumptionSuccess = false;

                try {
                    // 1. 결제 내역 생성
                    String paymentUrl = baseUrl + "/api/v1/payment-history/fetch-external/" + userId;
                    ResponseEntity<String> paymentResponse = restTemplate.exchange(
                            paymentUrl, HttpMethod.POST, entity, String.class);

                    paymentSuccess = paymentResponse.getStatusCode().is2xxSuccessful();
                    if (paymentSuccess) {
                        log.debug("✓ User {}: 결제 내역 생성 완료", userId);
                    } else {
                        log.warn("✗ User {}: 결제 내역 생성 실패", userId);
                        progress.paymentFailures.add(userId);
                    }

                    // 짧은 대기
                    Thread.sleep(50);

                    // 2. 소비 패턴 생성
                    String consumptionUrl = baseUrl + "/api/v1/consumption-pattern/fetch-external/" + userId;
                    ResponseEntity<String> consumptionResponse = restTemplate.exchange(
                            consumptionUrl, HttpMethod.POST, entity, String.class);

                    consumptionSuccess = consumptionResponse.getStatusCode().is2xxSuccessful();
                    if (consumptionSuccess) {
                        log.debug("✓ User {}: 소비 패턴 생성 완료", userId);
                    } else {
                        log.warn("✗ User {}: 소비 패턴 생성 실패", userId);
                        progress.consumptionFailures.add(userId);
                    }

                } catch (Exception e) {
                    log.error("User {} API 호출 실패: {}", userId, e.getMessage());
                    progress.errors.add("User " + userId + ": " + e.getMessage());
                }

                // 결과 업데이트
                if (paymentSuccess && consumptionSuccess) {
                    progress.successCount.incrementAndGet();
                    log.info("✓ User {} ({}): 완료", userId, user.getNickname());
                } else {
                    progress.failCount.incrementAndGet();
                }

                progress.processedCount.incrementAndGet();
                int processed = processedCount.incrementAndGet();

                // 진행률 로그
                if (processed % 10 == 0 || processed == users.size()) {
                    log.info("진행률: {}/{} ({:.1f}%)",
                            processed, users.size(),
                            (double) processed / users.size() * 100);
                }

                // API 부하 방지
                Thread.sleep(50);

            } catch (InterruptedException e) {
                log.warn("처리가 중단되었습니다.");
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                log.error("User {} 처리 중 예외: {}", userId, e.getMessage(), e);
                progress.failCount.incrementAndGet();
                progress.errors.add("User " + userId + ": " + e.getMessage());
            }
        }

        // 완료 처리
        progress.status = "COMPLETED";
        progress.endTime = LocalDateTime.now();

        log.info("\n=== 더미 데이터 생성 완료 ===");
        log.info("총 유저: {}명", users.size());
        log.info("성공: {}명", progress.successCount.get());
        log.info("실패: {}명", progress.failCount.get());
        log.info("성공률: {:.1f}%", (double) progress.successCount.get() / users.size() * 100);
    }

    public ServiceResult<Map<String, Object>> getDummyDataStatus() {
        Map<String, Object> result = new HashMap<>();

        if (progressMap.isEmpty()) {
            result.put("message", "실행 중인 작업이 없습니다.");
            return ServiceResult.success(result);
        }

        List<Map<String, Object>> tasks = new ArrayList<>();
        for (DummyDataProgress progress : progressMap.values()) {
            Map<String, Object> taskInfo = new HashMap<>();
            taskInfo.put("taskId", progress.taskId);
            taskInfo.put("status", progress.status);
            taskInfo.put("totalUsers", progress.totalUsers);
            taskInfo.put("processedCount", progress.processedCount.get());
            taskInfo.put("successCount", progress.successCount.get());
            taskInfo.put("failCount", progress.failCount.get());
            taskInfo.put("startTime", progress.startTime);
            taskInfo.put("endTime", progress.endTime);

            if (progress.totalUsers > 0) {
                taskInfo.put("progressPercentage",
                        (double) progress.processedCount.get() / progress.totalUsers * 100);
            }

            taskInfo.put("paymentFailures", progress.paymentFailures);
            taskInfo.put("consumptionFailures", progress.consumptionFailures);
            taskInfo.put("errors", progress.errors);

            tasks.add(taskInfo);
        }

        result.put("tasks", tasks);
        return ServiceResult.success(result);
    }

    // 진행 상황을 저장하는 내부 클래스
    private static class DummyDataProgress {
        String taskId;
        String status;
        int totalUsers;
        AtomicInteger processedCount = new AtomicInteger(0);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);
        LocalDateTime startTime;
        LocalDateTime endTime;
        List<Long> paymentFailures = Collections.synchronizedList(new ArrayList<>());
        List<Long> consumptionFailures = Collections.synchronizedList(new ArrayList<>());
        List<String> errors = Collections.synchronizedList(new ArrayList<>());
    }
}