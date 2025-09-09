package com.mango.backend.global.common.api;

import com.mango.backend.global.error.ErrorCode;
import lombok.Getter;

@Getter
public class ErrorResponse implements ApiResponse<Void> {

  private final String errorCode;
  private final String message;

  private ErrorResponse(ErrorCode errorCode) {
    this.errorCode = errorCode.getCode();
    this.message = errorCode.getMessage();
  }

  public static ErrorResponse of(ErrorCode errorCode) {
    return new ErrorResponse(errorCode);
  }

  @Override
  public boolean isSuccess() {
    return false;
  }
}

