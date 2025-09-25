package com.mango.backend.domain.chart.controller;

import com.mango.backend.domain.chart.service.ChartService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/chart")
@Tag(name = "Chart", description = "차트 관련 API")
public class ChartController extends BaseController {
    private final ChartService chartService;

    @GetMapping("myCategoryChart/{userId}")
    @Operation(summary = "내 카테고리 차트 조회", description = "사용자의 카테고리별 소비 패턴 차트를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "내 카테고리 차트 조회에 성공하였습니다."),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다.")
    })
    public ResponseEntity<BaseResponse> getMyCategoryChart(
            @Parameter(description = "사용자 ID", required = true, example = "1")
            @PathVariable Long userId,
            @Parameter(description = "기간 (1: 이번달, 2: 저번달, 3: 최근 6개월)", required = false, example = "1")
            @RequestParam(defaultValue = "1") int period
    ) {
        return toResponseEntity(chartService.getMyCategoryChart(userId,period), "내 카테고리 차트 조회에 성공하였습니다.");
    }

    @GetMapping("myMonthlyChart/{userId}")
    @Operation(summary = "내 이번달 결제 차트 조회", description = "사용자의 이번달 월별 결제 패턴 차트를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "내 이번달 결제 차트 조회에 성공하였습니다."),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다.")
    })
    public ResponseEntity<BaseResponse> getMyMonthlyChart(
            @Parameter(description = "사용자 ID", required = true, example = "1")
            @PathVariable Long userId
    ) {
        return toResponseEntity(chartService.getMyMonthlyChart(userId), "내 이번달 결제 차트 조회에 성공하였습니다.");
    }

    @GetMapping("myKeywordChart/{userId}")
    @Operation(summary = "내 최신 키워드 차트 조회", description = "사용자의 최신 소비 키워드 차트를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "내 최신 키워드 차트 조회에 성공하였습니다."),
            @ApiResponse(responseCode = "404", description = "소비패턴 데이터가 없습니다.")
    })
    public ResponseEntity<BaseResponse> getMyKeywordChart(
            @Parameter(description = "사용자 ID", required = true, example = "1")
            @PathVariable Long userId
    ) {
        return toResponseEntity(chartService.getMyKeywordChart(userId), "내 최신 키워드 차트 조회에 성공하였습니다.");
    }

    @GetMapping("myThisMonthChart/{userId}")
    @Operation(summary = "내 이번달 결제 금액 추이 차트 조회", description = "사용자의 이번달 일별 결제 금액 추이 차트를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "내 이번달 결제 금액 추이 차트 조회에 성공하였습니다."),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다.")
    })
    public ResponseEntity<BaseResponse> getMyThisMonthChart(
            @Parameter(description = "사용자 ID", required = true, example = "1")
            @PathVariable Long userId
    ) {
        return toResponseEntity(chartService.getMyThisMonthChart(userId), "내 이번달 결제 금액 추이 차트 조회에 성공하였습니다.");
    }

    @GetMapping("twoTimeChart/{myUserId}/{otherUserId}")
    @Operation(summary = "결제 시간별 비교 차트 조회", description = "두 사용자의 결제 시간대별 패턴을 비교하는 차트를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "결제 시간별 비교 차트 조회에 성공하였습니다."),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다.")
    })
    public ResponseEntity<BaseResponse> getMyTwoTimeChart(
            @Parameter(description = "내 사용자 ID", required = true, example = "1")
            @PathVariable Long myUserId,
            @Parameter(description = "비교할 사용자 ID", required = true, example = "2")
            @PathVariable Long otherUserId
    ) {
        return toResponseEntity(chartService.getTwoTimeChart(myUserId, otherUserId), "결제 시간별 비교 차트 조회에 성공하였습니다.");
    }

    @GetMapping("twoTypeChart/{myUserId}/{otherUserId}")
    @Operation(summary = "대표유형 비교 차트 조회", description = "두 사용자의 소비 대표유형을 비교하는 차트를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "대표유형 비교 차트 조회에 성공하였습니다."),
            @ApiResponse(responseCode = "404", description = "소비패턴 데이터가 없습니다.")
    })
    public ResponseEntity<BaseResponse> getTwoTypeChart(
            @Parameter(description = "내 사용자 ID", required = true, example = "1")
            @PathVariable Long myUserId,
            @Parameter(description = "비교할 사용자 ID", required = true, example = "2")
            @PathVariable Long otherUserId
    ) {
        return toResponseEntity(chartService.getTwoTypeChart(myUserId, otherUserId), "대표유형 비교 차트 조회에 성공하였습니다.");
    }

    @GetMapping("twoCategoryChart/{myUserId}/{otherUserId}")
    @Operation(
            summary = "두 사용자 카테고리별 소비 비교 차트 조회",
            description = "두 사용자의 최근 1개월간 카테고리별 소비 비중을 비교하여 피라미드 형태의 차트 데이터를 제공합니다. " +
                          "내 데이터는 음수로, 상대방 데이터는 양수로 반환되어 양방향 비교가 가능하며, " +
                          "각 사용자의 최고 소비 카테고리와 비중을 myHighest, otherHighest로 별도 제공합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "두 사용자의 카테고리별 소비 비교 차트 조회에 성공하였습니다.",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "message": "두 사용자의 카테고리별 소비 비교 차트 조회에 성공하였습니다.",
                                      "data": {
                                        "labels": ["학문/교육", "음식", "여가/오락", "생활서비스", "미디어/통신", "소매/유통", "공연/전시"],
                                        "myData": [-15, -9, -23, -19, -4, -27, -3],
                                        "partnerData": [1, 11, 31, 11, 4, 39, 3],
                                        "myHighest": { "소매/유통": "27" },
                                        "otherHighest": { "소매/유통": "39" }
                                      },
                                      "status": "SUCCESS"
                                    }
                                    """)
                    )),
            @ApiResponse(responseCode = "404", description = "해당 사용자들의 소비 데이터가 존재하지 않습니다.")
    })
    public ResponseEntity<BaseResponse> getTwoCategoryChart(
            @Parameter(description = "기준이 되는 사용자 ID (차트에서 음수로 표시, myHighest 기준)", required = true, example = "1")
            @PathVariable Long myUserId,
            @Parameter(description = "비교 대상 사용자 ID (차트에서 양수로 표시, otherHighest 기준)", required = true, example = "2")
            @PathVariable Long otherUserId
    ) {
        return toResponseEntity(chartService.getTwoCategoryChart(myUserId, otherUserId), "두 사용자의 카테고리별 소비 비교 차트 조회에 성공하였습니다.");
    }
}