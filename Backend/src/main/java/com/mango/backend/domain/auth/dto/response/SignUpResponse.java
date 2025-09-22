package com.mango.backend.domain.auth.dto.response;

import java.time.LocalDateTime;

public record SignUpResponse(
    Long userId,
    String email,
    String nickname,
    String token,
    LocalDateTime createdAt
) {

  public static SignUpResponse of(Long userId, String email, String nickname, String token,
      LocalDateTime createdAt) {
    return new SignUpResponse(userId, email, nickname, token, createdAt);
  }
}