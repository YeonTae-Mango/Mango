package com.mango.backend.domain.block.controller;

import com.mango.backend.domain.block.service.BlockService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/block")
public class BlockController extends BaseController {

  private final BlockService blockService;

  @Operation(summary = "사용자 차단", description = "특정 유저를 차단합니다.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "차단 성공"),
      @ApiResponse(responseCode = "404", description = "유저 없음")
  })
  @PostMapping("/{requestId}/{targetUserId}")
  public ResponseEntity<BaseResponse> blockUser(
      @PathVariable Long requestId,
      @PathVariable Long targetUserId,
      @RequestHeader("Authorization") String token) {

    return toResponseEntity(
        blockService.blockUser(requestId, targetUserId, token),
        "차단되었습니다."
    );
  }

  @Operation(summary = "차단한 사용자 목록 조회", description = "내가 차단한 사용자 리스트를 조회합니다.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "조회 성공"),
  })
  @GetMapping("/{userId}")
  public ResponseEntity<BaseResponse> getBlockedUsers(
      @RequestHeader("Authorization") String token,
      @PathVariable("userId") Long userId
  ) {

    return toResponseEntity(
        blockService.getBlockedUsers(userId, token),
        "차단한 사용자 조회에 성공했습니다."
    );
  }
}
