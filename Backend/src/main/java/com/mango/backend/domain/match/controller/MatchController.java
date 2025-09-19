package com.mango.backend.domain.match.controller;

import com.mango.backend.domain.match.service.MatchService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/match")
@RequiredArgsConstructor
public class MatchController extends BaseController {

  private final MatchService matchService;

  @Operation(
      summary = "유저 목록 조회 (임시 목데이터 사용중)",
      description = "주어진 위도/경도를 기준으로 가까운 순으로 유저 목록을 조회합니다. " +
          "한 페이지당 10개씩 반환하며(아직 안됨, 일단 다 주는 중;), 검색 결과가 없으면 빈 리스트를 반환합니다."
  )
  @GetMapping("/swipe/{userId}")
  public ResponseEntity<BaseResponse> getNearbyUsers(
      @RequestHeader("Authorization") String token,
      @PathVariable Long userId) {
    return toResponseEntity(matchService.getSwipeList(token, userId),
        "근처 사용자 목록 조회에 성공하였습니다.");
  }

}
