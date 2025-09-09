package com.mango.backend.global.error;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

  /* ============================
     AUTH (인증 관련)
     ============================ */
  AUTH_REQUIRED("AUTH_001", "인증이 필요합니다."),
  AUTH_FORBIDDEN("AUTH_002", "접근 권한이 없습니다."),
  AUTH_INVALID_CREDENTIALS("AUTH_005", "이메일 또는 비밀번호가 일치하지 않습니다."),
  AUTH_INVALID_TOKEN("AUTH_009", "유효하지 않은 토큰입니다."),
  AUTH_REFRESH_TOKEN_EXPIRED("AUTH_010", "리프레시 토큰이 만료되었습니다."),

  /* ============================
     USER (사용자 관련)
     ============================ */
  USER_AUTH_REQUIRED("USER_001", "인증이 필요합니다."),
  USER_INVALID_INPUT("USER_002", "잘못된 입력값입니다."),
  USER_FILE_TOO_LARGE("USER_003", "파일 크기가 너무 큽니다."),
  USER_UNSUPPORTED_FILE("USER_004", "지원하지 않는 파일 형식입니다."),
  USER_PASSWORD_MISMATCH("USER_005", "현재 비밀번호가 일치하지 않습니다."),
  USER_INVALID_PASSWORD_FORMAT("USER_006", "비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다."),
  USER_EMAIL_ALREADY_EXISTS("USER_007", "이미 사용중인 이메일입니다."),

  /* ============================
     SERVER ERROR (서버 내부 오류)
     ============================ */
  SERVER_ERROR("SERVER_001", "서버 내부 오류가 발생했습니다.");

  private final String code;
  private final String message;

}
