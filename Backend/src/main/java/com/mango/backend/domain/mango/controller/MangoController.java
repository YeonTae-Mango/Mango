package com.mango.backend.domain.mango.controller;

import com.mango.backend.domain.mango.dto.request.MangoRequest;
import com.mango.backend.domain.mango.dto.response.MangoUserResponse;
import com.mango.backend.domain.mango.service.MangoService;
import com.mango.backend.domain.visited.dto.request.VisitedRequest;
import com.mango.backend.domain.visited.service.VisitedService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.common.api.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mango")
public class MangoController extends BaseController {

  private final MangoService mangoService;
  private final VisitedService visitedService;

  @Operation(summary = "나를 망고한 사람 조회", description = "특정 유저를 좋아요(망고)한 사람들의 리스트를 조회합니다.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "조회 성공",
          content = @Content(schema = @Schema(implementation = MangoUserResponse.class))),
      @ApiResponse(responseCode = "404", description = "유저 없음", content = @Content)
  })
  @GetMapping("/{userId}/followers")
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
  @GetMapping("/{userId}/following")
  public ResponseEntity<BaseResponse> getFollowing(
      @PathVariable Long userId,
      @RequestParam Integer page,
      @RequestHeader("Authorization") String token) {
    return toResponseEntity(mangoService.getUsersILiked(userId, page), "내가 망고한 사람 조회에 성공했습니다.");
  }

  @Operation(
          summary = "사람 망고하기",
          description = "특정 유저에게 좋아요(망고)를 합니다. 자기 자신에게는 망고할 수 없습니다."
  )
  @ApiResponses(value = {
          @ApiResponse(responseCode = "200", description = "망고 성공"),
          @ApiResponse(responseCode = "400", description = "잘못된 요청", content = @Content(schema = @Schema(implementation = BaseResponse.class))),
          @ApiResponse(responseCode = "404", description = "유저를 찾을 수 없음", content = @Content(schema = @Schema(implementation = BaseResponse.class)))
  })
  @PostMapping("like/{userId}")
  public ResponseEntity<BaseResponse> likeUser(
          @PathVariable Long userId,
          @RequestBody MangoRequest request
  ) {
    ServiceResult<Void> result = mangoService.likeUser(userId, request.requestId());
    return toResponseEntity(result, "망고에 성공하였습니다.");
  }

  @Operation(summary = "사람 싫어요 하기(= 방문 처리 하기)", description = "특정 유저를 방문 처리합니다. 다음에 목록 조회 시 visited 여부로 필터링 됩니다.")
  @ApiResponses({
          @ApiResponse(responseCode = "200", description = "방문 처리 성공"),
          @ApiResponse(responseCode = "404", description = "유저를 찾을 수 없음")
  })
  @PostMapping("/dislike/{userId}")
  public ResponseEntity<BaseResponse> visitUser(
          @PathVariable Long userId,
          @RequestBody VisitedRequest request
  ) {
    ServiceResult<Void> result = visitedService.markVisited(userId, request.requestId());
    return toResponseEntity(result, "싫어요 처리에 성공하였습니다.");
  }
}
