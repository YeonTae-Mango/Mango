package com.mango.backend.domain.user.controller;


import com.mango.backend.domain.user.service.UserService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController extends BaseController {

  private final UserService userService;

  @Operation(summary = "회원 탈퇴", description = "JWT 토큰을 이용해 본인 계정을 탈퇴합니다.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "회원 탈퇴 성공",
          content = @io.swagger.v3.oas.annotations.media.Content),
      @ApiResponse(responseCode = "403", description = "본인 계정만 탈퇴 가능",
          content = @io.swagger.v3.oas.annotations.media.Content),
      @ApiResponse(responseCode = "400", description = "잘못된 입력값",
          content = @io.swagger.v3.oas.annotations.media.Content)
  })
  @DeleteMapping("/{userId}")
  public ResponseEntity<BaseResponse> deleteUser(
      @PathVariable Long userId,
      @RequestHeader("Authorization") String token) {
    return toResponseEntity(userService.deleteUser(userId, token), "회원 탈퇴에 성공했습니다.");
  }
}
