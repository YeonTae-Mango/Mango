package com.mango.backend.domain.admin.controller;

import com.mango.backend.domain.admin.service.DummyDataService;
import com.mango.backend.global.common.ServiceResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Admin - Dummy Data API", description = "더미 데이터 생성 및 상태 조회 관련 API")
@RestController
@RequestMapping("/api/v1/admin/dummy")
@RequiredArgsConstructor
@Slf4j
public class DummyDataController {

    private final DummyDataService dummyDataService;

    @Operation(summary = "⭐모든 유저의 더미 데이터 생성", description = "시스템에 존재하는 모든 유저에 대한 더미 데이터를 생성하는 작업을 시작합니다.")
    @ApiResponse(responseCode = "200", description = "작업 시작 성공",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ServiceResult.class),
                    examples = @ExampleObject(value = "{ \"data\": { \"message\": \"모든 유저에 대한 더미 데이터 생성을 시작합니다.\", \"status\": \"RUNNING\" } }")))
    @PostMapping("/generate-all")
    public ServiceResult<Map<String, Object>> generateAllDummyData() {
        log.info("모든 유저 더미 데이터 생성 요청");
        return dummyDataService.generateAllDummyData();
    }

    @Operation(summary = "특정 유저 ID부터 더미 데이터 생성", description = "지정된 유저 ID부터 시작하여 이후의 모든 유저에 대한 더미 데이터를 생성합니다.")
    @ApiResponse(responseCode = "200", description = "작업 시작 성공")
    @PostMapping("/generate-from/{startUserId}")
    public ServiceResult<Map<String, Object>> generateDummyDataFromUser(
            @Parameter(name = "startUserId", description = "더미 데이터 생성을 시작할 유저의 ID", required = true, example = "10")
            @PathVariable Long startUserId) {
        log.info("User ID {}부터 더미 데이터 생성 요청", startUserId);
        return dummyDataService.generateDummyDataFromUser(startUserId);
    }

    @Operation(summary = "특정 유저들의 더미 데이터 생성", description = "요청 본문에 포함된 유저 ID 목록에 해당하는 유저들의 더미 데이터를 생성합니다.")
    @ApiResponse(responseCode = "200", description = "작업 시작 성공")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "더미 데이터를 생성할 유저 ID 목록", required = true,
            content = @Content(schema = @Schema(implementation = Map.class),
                    examples = @ExampleObject(value = "{ \"userIds\": [1, 2, 3, 10, 25] }")))
    @PostMapping("/generate-users")
    public ServiceResult<Map<String, Object>> generateDummyDataForSpecificUsers(
            @RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        var userIds = (java.util.List<Long>) request.get("userIds");
        log.info("특정 유저들({})의 더미 데이터 생성 요청", userIds);
        return dummyDataService.generateDummyDataForUsers(userIds);
    }

    @Operation(summary = "⭐더미 데이터 생성 상태 조회", description = "현재 진행 중인 더미 데이터 생성 작업의 상태를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "상태 조회 성공",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ServiceResult.class),
                    examples = @ExampleObject(value = "{ \"data\": { \"status\": \"RUNNING\", \"progress\": \"50/100\", \"percentage\": 50.0 } }")))
    @GetMapping("/status")
    public ServiceResult<Map<String, Object>> getDummyDataStatus() {
        return dummyDataService.getDummyDataStatus();
    }
}