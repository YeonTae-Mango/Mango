package com.mango.backend.domain.auth.controller;

import com.mango.backend.domain.auth.dto.request.LoginRequest;
import com.mango.backend.domain.auth.dto.request.SignUpRequest;
import com.mango.backend.domain.auth.service.AuthService;
import com.mango.backend.global.common.api.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  // 회원가입
  @PostMapping("/signup")
  public ResponseEntity<ApiResponse<?>> signUp(@RequestBody SignUpRequest request) {
    return ResponseEntity.ok(authService.signUp(request));
  }

  // 로그인
  @PostMapping("/login")
  public ResponseEntity<ApiResponse<?>> login(@RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }

  // 로그아웃
  @PostMapping("/logout")
  public ResponseEntity<ApiResponse<?>> logout(@RequestHeader("Authorization") String token) {
    return ResponseEntity.ok(authService.logout(token));
  }

}
