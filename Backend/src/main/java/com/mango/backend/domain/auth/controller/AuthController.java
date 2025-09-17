package com.mango.backend.domain.auth.controller;

import com.mango.backend.domain.auth.dto.request.LoginRequest;
import com.mango.backend.domain.auth.dto.request.SignUpRequest;
import com.mango.backend.domain.auth.service.AuthService;
import com.mango.backend.global.common.BaseController;
import com.mango.backend.global.common.api.BaseResponse;
import com.mango.backend.global.common.api.ErrorResponse;
import com.mango.backend.global.common.api.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController extends BaseController {

  private final AuthService authService;

  @Operation(summary = "회원가입", description = "새로운 유저를 등록합니다.")
  @ApiResponses({
      @ApiResponse(
          responseCode = "200",
          description = "회원가입 성공",
          content = @Content(schema = @Schema(implementation = SuccessResponse.class))
      ),
      @ApiResponse(
          responseCode = "400",
          description = "잘못된 요청 (유효성 검사 실패)",
          content = @Content(schema = @Schema(implementation = BaseResponse.class))
      )
  })
  @PostMapping("/signup")
  public ResponseEntity<BaseResponse> signUp(@RequestBody SignUpRequest request) {
    return toResponseEntity(authService.signUp(request), "회원가입에 성공했습니다.");
  }

  @Operation(summary = "로그인", description = "유저 인증 후 JWT 토큰을 발급합니다.")
  @ApiResponses({
      @ApiResponse(
          responseCode = "200",
          description = "로그인 성공 (JWT 토큰 반환)",
          content = @Content(schema = @Schema(implementation = SuccessResponse.class))
      ),
      @ApiResponse(
          responseCode = "401",
          description = "이메일/비밀번호 불일치",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class))
      ),
      @ApiResponse(
          responseCode = "409",
          description = "프로필 이미지 미설정 – 프로필 설정 화면으로 이동 필요",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class))
      )
  })
  @PostMapping("/login")
  public ResponseEntity<BaseResponse> login(@RequestBody LoginRequest request) {
    return toResponseEntity(authService.login(request), "로그인에 성공했습니다.");
  }

  @Operation(summary = "로그아웃", description = "Redis에서 JWT 토큰 제거")
  @ApiResponses({
      @ApiResponse(
          responseCode = "200",
          description = "로그아웃 성공",
          content = @Content(schema = @Schema(implementation = SuccessResponse.class))
      )
  })
  @PostMapping("/logout")
  public ResponseEntity<BaseResponse> logout(@RequestHeader("Authorization") String token) {
    return toResponseEntity(authService.logout(token), "로그아웃에 성공했습니다.");
  }

  @Operation(summary = "이메일 중복 확인", description = "입력한 이메일이 이미 사용 중인지 확인합니다.")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "사용 가능한 이메일",
          content = @Content(schema = @Schema(implementation = SuccessResponse.class))),
      @ApiResponse(responseCode = "409", description = "이미 존재하는 이메일",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  })
  @GetMapping("/check-email")
  public ResponseEntity<BaseResponse> checkEmail(@RequestParam String email) {
    return toResponseEntity(authService.checkEmail(email), "사용 가능한 이메일입니다.");
  }

  @Operation(summary = "닉네임 중복 확인", description = "입력한 닉네임이 이미 사용 중인지 확인합니다.")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "사용 가능한 닉네임",
          content = @Content(schema = @Schema(implementation = SuccessResponse.class))),
      @ApiResponse(responseCode = "409", description = "이미 존재하는 닉네임",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
  })
  @GetMapping("/check-nickname")
  public ResponseEntity<BaseResponse> checkNickname(@RequestParam String nickname) {
    return toResponseEntity(authService.checkNickname(nickname), "사용 가능한 닉네임입니다.");
  }
}
