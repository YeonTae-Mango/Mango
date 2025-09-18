package com.mango.backend.domain.chart.service;

import com.mango.backend.domain.chart.dto.response.MyCategoryChartResponse;
import com.mango.backend.domain.chart.dto.response.MyMonthlyChartResponse;
import com.mango.backend.domain.maincode.entity.MainCode;
import com.mango.backend.domain.maincode.repository.MainCodeRepository;
import com.mango.backend.domain.paymenthistory.entity.PaymentHistory;
import com.mango.backend.domain.paymenthistory.repository.PaymentHistoryRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ChartService {

    private final JwtProvider jwtProvider;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final MainCodeRepository mainCodeRepository;

    public ServiceResult<MyCategoryChartResponse> getMyCategoryChart(Long userId) {
        Instant now = Instant.now();
        Instant oneMonthAgo = now.minus(30, ChronoUnit.DAYS);

        List<PaymentHistory> recentOneMonthPayments = paymentHistoryRepository.findByUserIdAndPaymentDateBetween(userId, oneMonthAgo, now);
        List<MainCode> mainCodes = mainCodeRepository.findByMainCodeStartingWith("PH_");
        Map<String, Long> statistics = new HashMap<>();
        long total = 0L;

        for (MainCode mainCode : mainCodes) {
            statistics.put(mainCode.getMainCodeName(), 0L);
        }

        for (PaymentHistory paymentHistory : recentOneMonthPayments) {
            statistics.merge(paymentHistory.getPrimaryCategory(), paymentHistory.getPrice(), Long::sum);
            total += paymentHistory.getPrice();
        }

        List<Map.Entry<String, Long>> entries = new ArrayList<>(statistics.entrySet());
        entries.sort(Map.Entry.<String, Long>comparingByValue().reversed());

        String[] label = new String[entries.size()];
        Long[] data = new Long[entries.size()];
        Integer[] weight = new Integer[entries.size()];
        for (int i = 0; i < entries.size(); i++) {
            Map.Entry<String, Long> entry = entries.get(i);
            label[i] = entry.getKey();
            data[i] = entry.getValue();
            weight[i] = (int) Math.round(((double) entry.getValue() / total) * 100);
        }

        Map<String, String> highest = new HashMap<>();
        for (int i = 0; i < 2; i++) {
            highest.put(label[i], weight[i].toString());
        }


        MyCategoryChartResponse response = new MyCategoryChartResponse(label, data, weight, Long.toString(total), highest);
        return ServiceResult.success(response);
    }

    public ServiceResult<MyMonthlyChartResponse> getMyMonthlyChart(Long userId) {
        Instant now = Instant.now();
        Instant sixMonthAgo = now.atZone(ZoneId.systemDefault())
                .minusMonths(6)
                .toInstant();

        List<PaymentHistory> recentOneMonthPayments = paymentHistoryRepository.findByUserIdAndPaymentDateBetween(userId, sixMonthAgo, now);
        Map<Integer, Long> statistics = new HashMap<>();
        for (PaymentHistory paymentHistory : recentOneMonthPayments) {
            statistics.merge(LocalDateTime.ofInstant(paymentHistory.getPaymentDate(), ZoneId.systemDefault()).getMonthValue(),
                    paymentHistory.getPrice(), Long::sum);
        }

        List<Map.Entry<Integer, Long>> entries = new ArrayList<>(statistics.entrySet());
        entries.sort(Map.Entry.comparingByKey());

        String[] label = new String[entries.size()];
        Long[] data = new Long[entries.size()];
        for (int i = 0; i < entries.size(); i++) {
            label[i] = entries.get(i).getKey().toString();
            data[i] = entries.get(i).getValue();
        }

        MyMonthlyChartResponse response = new MyMonthlyChartResponse(label, data);
        return ServiceResult.success(response);
    }

}
