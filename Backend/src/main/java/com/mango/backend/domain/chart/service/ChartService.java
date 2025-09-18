package com.mango.backend.domain.chart.service;

import com.mango.backend.domain.chart.dto.response.MyCategoryChartResponse;
import com.mango.backend.domain.chart.dto.response.MyMonthlyChartResponse;
import com.mango.backend.domain.maincode.entity.MainCode;
import com.mango.backend.domain.maincode.repository.MainCodeRepository;
import com.mango.backend.domain.paymenthistory.entity.PaymentHistory;
import com.mango.backend.domain.paymenthistory.repository.PaymentHistoryRepository;
import com.mango.backend.global.common.ServiceResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ChartService {

    private final PaymentHistoryRepository paymentHistoryRepository;
    private final MainCodeRepository mainCodeRepository;

    public ServiceResult<MyCategoryChartResponse> getMyCategoryChart(Long userId) {
        log.info("getMyCategoryChart {}", userId);
        LocalDateTime now = LocalDateTime.now();

        LocalDateTime oneMonthAgo = now.minusMonths(1);

        List<PaymentHistory> recentOneMonthPayments = paymentHistoryRepository.findByUserIdAndPaymentTimeBetween(userId, oneMonthAgo, now);
        log.info("recentOneMonthPayments {}", recentOneMonthPayments);
        List<MainCode> mainCodes = mainCodeRepository.findByMainCodeStartingWith("PH_");
        Map<String, Long> statistics = new HashMap<>();
        long total = 0L;

        for (MainCode mainCode : mainCodes) {
            statistics.put(mainCode.getMainCodeName(), 0L);
        }
        log.info("getMyCategoryChart {}", statistics);

        for (PaymentHistory paymentHistory : recentOneMonthPayments) {
            statistics.merge(paymentHistory.getCategory(), paymentHistory.getPaymentAmount(), Long::sum);
            total += paymentHistory.getPaymentAmount();
        }
        log.info("recentOneMonthPayments {}", recentOneMonthPayments);
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
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sixMonthAgo = now.minusMonths(6);

        List<PaymentHistory> recentOneMonthPayments = paymentHistoryRepository.findByUserIdAndPaymentTimeBetween(userId, sixMonthAgo, now);
        Map<Integer, Long> statistics = new HashMap<>();
        for (PaymentHistory paymentHistory : recentOneMonthPayments) {
            statistics.merge(paymentHistory.getPaymentTime().getMonthValue(), paymentHistory.getPaymentAmount(), Long::sum);
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
