package com.mango.backend.domain.auth.dto.response;

public record LoginResponse(
    Long userId,
    String token
) {

  public static LoginResponse of(Long userId, String token) {
    return new LoginResponse(userId, token);
  }
}