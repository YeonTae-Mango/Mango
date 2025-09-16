package com.mango.backend.domain.mango.controller;

import com.mango.backend.domain.mango.dto.response.MangoUserResponse;
import com.mango.backend.domain.mango.service.MangoService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MangoController extends BaseController {

  private final MangoService mangoService;

  @Operation(summary = "나를 망고한 사람 조회", description = "특정 유저를 좋아요(망고)한 사람들의 리스트를 조회합니다.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "조회 성공",
          content = @Content(schema = @Schema(implementation = MangoUserResponse.class))),
      @ApiResponse(responseCode = "404", description = "유저 없음", content = @Content)
  })
  @GetMapping("/mango/{userId}/followers")
  public ResponseEntity<BaseResponse> getFollowers(
      @PathVariable Long userId,
      @RequestParam Integer page,
      @RequestHeader("Authorization") String token) {
    return toResponseEntity(mangoService.getUsersWhoLikedMe(userId, page), "나를 망고한 사람 조회에 성공했습니다.");
  }

  @Operation(summary = "내가 망고한 사람 조회", description = "특정 유저가 좋아요(망고)한 사람들의 리스트를 조회합니다.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "조회 성공",
          content = @Content(schema = @Schema(implementation = MangoUserResponse.class))),
      @ApiResponse(responseCode = "404", description = "유저 없음", content = @Content)
  })
  @GetMapping("/mango/{userId}/following")
  public ResponseEntity<BaseResponse> getFollowing(
      @PathVariable Long userId,
      @RequestParam Integer page,
      @RequestHeader("Authorization") String token) {
    return toResponseEntity(mangoService.getUsersILiked(userId, page), "내가 망고한 사람 조회에 성공했습니다.");
  }
}
