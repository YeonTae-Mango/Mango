package com.mango.backend.domain.chart.service;

import com.mango.backend.domain.chart.dto.response.*;
import com.mango.backend.domain.consumptionpattern.entity.ConsumptionPattern;
import com.mango.backend.domain.consumptionpattern.entity.TypeItem;
import com.mango.backend.domain.consumptionpattern.repository.ConsumptionPatternRepository;
import com.mango.backend.domain.maincode.entity.MainCode;
import com.mango.backend.domain.maincode.repository.MainCodeRepository;
import com.mango.backend.domain.paymenthistory.entity.PaymentHistory;
import com.mango.backend.domain.paymenthistory.repository.PaymentHistoryRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private final ConsumptionPatternRepository consumptionPatternRepository;

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

    public ServiceResult<MyThisMonthChartResponse> getMyThisMonthChart(Long userId) {
        List<PaymentHistory> recentOneMonthPayments = paymentHistoryRepository.findByUserIdAndPaymentTimeBetween(userId, LocalDateTime.now().minusMonths(1).withDayOfMonth(1), LocalDateTime.now());
        Long[] lastMonth = new Long[31];
        Long[] thisMonthRaw = new Long[31];
        lastMonth[0] = 0L;
        thisMonthRaw[0] = 0L;
        int todayIndex = LocalDate.now().getDayOfMonth() - 1;
        int lastMonthIndex = LocalDate.now().minusMonths(1).getMonthValue();

        Long lastMonthCost = 0L;
        Long thisMonthCost = 0L;
        int lastMonthLastDay = LocalDate.now().minusMonths(1).lengthOfMonth();
        for (PaymentHistory ph : recentOneMonthPayments) {
            LocalDateTime phTime = ph.getPaymentTime();

            if (lastMonthIndex == phTime.getMonthValue()) {
                lastMonthCost += ph.getPaymentAmount();
                lastMonth[phTime.getDayOfMonth() - 1] = lastMonthCost;
            } else {
                thisMonthCost += ph.getPaymentAmount();
                thisMonthRaw[phTime.getDayOfMonth() - 1] = thisMonthCost;
            }
        }
        for (int i = 1; i < 31; i++) {
            if (i < lastMonthLastDay && lastMonth[i] == null && lastMonth[i - 1] != null) {
                lastMonth[i] = lastMonth[i - 1];
            }
            if (i <= todayIndex && thisMonthRaw[i] == null && thisMonthRaw[i - 1] != null) {
                thisMonthRaw[i] = thisMonthRaw[i - 1];
            }
        }
        Long[] lastMonthInTenK = new Long[31];
        Long[] thisMonthInTenK = new Long[31];

        for (int i = 0; i < 31; i++) {
            lastMonthInTenK[i] = lastMonth[i] != null ? lastMonth[i] / 10000 : null;
            thisMonthInTenK[i] = thisMonthRaw[i] != null ? thisMonthRaw[i] / 10000 : null;
        }

        MyThisMonthChartResponse response = new MyThisMonthChartResponse(lastMonthInTenK, thisMonthInTenK, todayIndex);
        return ServiceResult.success(response);
    }

    public ServiceResult<MyKeywordChartResponse> getMyKeywordChart(Long userId) {
        ConsumptionPattern latestPattern = consumptionPatternRepository.findFirstByUserIdOrderByEndDateDesc(userId);
        if (latestPattern == null) {
            return ServiceResult.failure(ErrorCode.NO_CONSUMPTION_PATTERNS);
        }
        String[] labels = new String[6];
        int[] data = new int[6];

        for (int i = 0; i < 6; i++) {
            labels[i] = latestPattern.getKeyword().get(i).getName();
            data[i] = (int) Math.round(latestPattern.getKeyword().get(i).getScore() * 100);
        }
        MyKeywordChartResponse response = new MyKeywordChartResponse(labels, data);
        return ServiceResult.success(response);
    }

    public ServiceResult<TwoTimeChartResponse> getTwoTimeChart(Long myUserId, Long otherUserId) {
        List<PaymentHistory> myPayments = paymentHistoryRepository.findByUserIdAndPaymentTimeBetween(myUserId, LocalDateTime.now().minusMonths(6), LocalDateTime.now());
        List<PaymentHistory> otherPayments = paymentHistoryRepository.findByUserIdAndPaymentTimeBetween(otherUserId, LocalDateTime.now().minusMonths(6), LocalDateTime.now());

        int[] myData = new int[4];
        int[] yourData = new int[4];
        String[] timeLabels = {"06시", "12시", "18시", "24시"};
        String[] hotTimes = new String[2];

        countPaymentByTime(myPayments, myData);
        countPaymentByTime(otherPayments, yourData);

        int myBigIndex = 0;
        int bigData = myData[0];
        for (int i = 1; i < 4; i++) {
            if (bigData < myData[i]) {
                bigData = myData[i];
                myBigIndex = i;
            }
        }
        hotTimes[0] = getTimeRangeString(myBigIndex);

        int otherBigIndex = 0;
        int otherBigData = yourData[0];
        for (int i = 1; i < 4; i++) {
            if (otherBigData < yourData[i]) {
                otherBigData = yourData[i];
                otherBigIndex = i;
            }
        }
        hotTimes[1] = getTimeRangeString(otherBigIndex);
        TwoTimeChartResponse response = new TwoTimeChartResponse(myData, yourData, timeLabels, hotTimes);
        return ServiceResult.success(response);
    }

    public ServiceResult<TwoTypeChartResponse> getTwoTypeChart(Long myUserId, Long otherUserId) {
        List<MainCode> mainTypes = mainCodeRepository.findByMainCodeStartingWith("LS_");
        for (int i = 0; i < mainTypes.size(); i++) {
            if (mainTypes.get(i).getMainCodeName().equals("음식")) {
                mainTypes.remove(i);
                break;
            }
        }
        ConsumptionPattern myLatestPattern = consumptionPatternRepository.findFirstByUserIdOrderByEndDateDesc(myUserId);
        ConsumptionPattern otherLatestPattern = consumptionPatternRepository.findFirstByUserIdOrderByEndDateDesc(otherUserId);
        String[] labels = new String[mainTypes.size()];
        int[] myData = new int[mainTypes.size()];
        int[] partnerData = new int[mainTypes.size()];

        Map<String, Integer> myDataMap = new HashMap<>();
        Map<String, Integer> otherDataMap = new HashMap<>();

        for (TypeItem ti : myLatestPattern.getMainType()) {
            myDataMap.put(ti.getName(), (int) (ti.getProb() * 100));
        }
        for (TypeItem ti : otherLatestPattern.getMainType()) {
            otherDataMap.put(ti.getName(), (int) (ti.getProb() * 100));
        }

        for (int i = 0; i < mainTypes.size(); i++) {
            String typeName = mainTypes.get(i).getMainCodeName();
            labels[i] = typeName;
            myData[i] = myDataMap.getOrDefault(typeName, 0);
            partnerData[i] = otherDataMap.getOrDefault(typeName, 0);
        }

        TwoTypeChartResponse response = new TwoTypeChartResponse(labels, myData, partnerData);
        return ServiceResult.success(response);
    }

    private static void countPaymentByTime(List<PaymentHistory> payments, int[] data) {
        for (PaymentHistory ph : payments) {
            LocalDateTime phTime = ph.getPaymentTime();
            if (phTime.getHour() <= 6) {
                data[0]++;
            } else if (phTime.getHour() <= 12) {
                data[1]++;
            } else if (phTime.getHour() <= 18) {
                data[2]++;
            } else {
                data[3]++;
            }
        }
    }

    private String getTimeRangeString(int index) {
        if (index == 0) {
            return "자정 ~ 오전 6시";
        } else if (index == 1) {
            return "오전 6시 ~ 정오";
        } else if (index == 2) {
            return "정오 ~ 오후 6시";
        } else {
            return "오후 6시 ~ 자정";
        }
    }
}
