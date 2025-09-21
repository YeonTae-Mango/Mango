package com.mango.backend.domain.match.controller;

import com.mango.backend.domain.match.service.MatchService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/api/v1/match")
@RequiredArgsConstructor
public class MatchController extends BaseController {

  private final MatchService matchService;


  @Operation(
          summary = "유저 목록 조회 (임시 목데이터 사용중)",
          description = "주어진 기준으로 가까운 순으로 유저 목록을 조회합니다. " +
                  "카테고리를 선택하면 해당 유형만 필터링하며, 검색 결과가 없으면 빈 리스트를 반환합니다."
  )
  @GetMapping("/swipe")
  public ResponseEntity<BaseResponse> getNearbyUsers(
          @RequestHeader("Authorization") String token,
          @Parameter(description = "조회할 유저 ID", required = true)
          @RequestParam Long userId,
          @Parameter(description = "선택 카테고리 (optional)")
          @RequestParam(required = false) String category
  ) {
    return toResponseEntity(
            matchService.getSwipeList(token, userId, category),
            "근처 사용자 목록 조회에 성공하였습니다."
    );
  }

}
