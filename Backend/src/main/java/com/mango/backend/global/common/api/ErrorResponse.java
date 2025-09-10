package com.mango.backend.global.common.api;

import com.mango.backend.global.error.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ErrorResponse implements BaseResponse<Void> {

  private final ErrorCode errorCode;
  private final String message;

  private ErrorResponse(ErrorCode errorCode) {
    this.errorCode = errorCode;
    this.message = errorCode.getMessage();
  }

  public static ErrorResponse of(ErrorCode errorCode) {
    return new ErrorResponse(errorCode);
  }

  @Override
  public boolean isSuccess() {
    return false;
  }

  @Override
  public String getMessage() {
    return message;
  }

  // Optional: HTTP 상태코드 가져오기
  public int getStatus() {
    return errorCodeToHttpStatus().value();
  }

  private HttpStatus errorCodeToHttpStatus() {
    return errorCode.getStatus(); // ErrorCode에 HttpStatus 추가되어 있어야 함
  }
}
