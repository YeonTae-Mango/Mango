package com.mango.backend.global.common.api;

import static com.mango.backend.global.common.api.ResponseStatus.FAIL;

import com.mango.backend.global.error.ErrorCode;
import lombok.Getter;

@Getter
public class ErrorResponse extends BaseResponse {

  private final ErrorCode errorCode;

  private ErrorResponse(ErrorCode errorCode) {
    super(FAIL, errorCode.getMessage());
    this.errorCode = errorCode;
  }

  public static ErrorResponse of(ErrorCode errorCode) {
    return new ErrorResponse(errorCode);
  }
}
