package com.mango.backend.global.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

  /* ============================
     AUTH (인증 관련)
     ============================ */
  AUTH_REQUIRED("AUTH_001", "인증이 필요합니다.", HttpStatus.UNAUTHORIZED),
  AUTH_FORBIDDEN("AUTH_002", "접근 권한이 없습니다.", HttpStatus.FORBIDDEN),
  AUTH_INVALID_CREDENTIALS("AUTH_005", "이메일 또는 비밀번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED),
  AUTH_INVALID_TOKEN("AUTH_009", "유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED),
  /* ============================
     USER (사용자 관련)
     ============================ */
  USER_AUTH_REQUIRED("USER_001", "인증이 필요합니다.", HttpStatus.UNAUTHORIZED),
  USER_INVALID_INPUT("USER_002", "잘못된 입력값입니다.", HttpStatus.BAD_REQUEST),
  USER_FILE_TOO_LARGE("USER_003", "파일 크기가 너무 큽니다.", HttpStatus.PAYLOAD_TOO_LARGE),
  USER_UNSUPPORTED_FILE("USER_004", "지원하지 않는 파일 형식입니다.", HttpStatus.UNSUPPORTED_MEDIA_TYPE),
  USER_INVALID_PASSWORD_FORMAT("USER_006", "비밀번호는 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.",
      HttpStatus.BAD_REQUEST),
  USER_EMAIL_ALREADY_EXISTS("USER_007", "이미 사용중인 이메일입니다.", HttpStatus.CONFLICT),
  USER_NICKNAME_ALREADY_EXISTS("USER_008", "이미 사용중인 닉네임입니다.", HttpStatus.CONFLICT),
  USER_NOT_FOUND("USER_009", "사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
  USER_NICKNAME_LENGTH("USER010", "닉네임은 1자 이상 10자 이하여야 합니다.", HttpStatus.BAD_REQUEST),
  USER_INVALID_LOCATION("USER011", "위치 정보를 다시 확인해주세요", HttpStatus.BAD_REQUEST),
  USER_INVALID_DISTANCE("USER012", "거리제한을 다시 확인해주세요", HttpStatus.BAD_REQUEST),
  USER_INVALID_INTRODUCTION("USER013", "한줄소개를 다시 확인해주세요", HttpStatus.BAD_REQUEST),
  USER_ALEADY_BLOCKED("USER014", "이미 차단된 사용자입니다.", HttpStatus.BAD_REQUEST),
  /* ============================
     FILE ERROR(파일 업로드 관련)
     ============================ */
  FILE_UPLOAD_FAILED("FILE000", "파일 업로드에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
  FILE_TOO_MANY("FILE001", "업로드 가능한 파일 개수를 초과했습니다.", HttpStatus.BAD_REQUEST),
  FILE_NOT_FOUND("FILE002", "파일을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
  /* ============================
     SERVER ERROR (서버 내부 오류)
     ============================ */
  SERVER_ERROR("SERVER_001", "서버 내부 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

  private final String code;
  private final String message;
  private final HttpStatus status;
}
