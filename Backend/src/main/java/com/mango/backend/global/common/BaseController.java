package com.mango.backend.global.common;

import com.mango.backend.global.common.api.BaseResponse;
import com.mango.backend.global.common.api.ErrorResponse;
import com.mango.backend.global.common.api.SuccessResponse;
import org.springframework.http.ResponseEntity;

public abstract class BaseController {

  protected <T> ResponseEntity<BaseResponse> toResponseEntity(ServiceResult<T> result,
      String successMessage) {
    if (!result.success()) {
      return ResponseEntity
          .status(result.errorCode().getStatus())
          .body(ErrorResponse.of(result.errorCode()));
    }
    return ResponseEntity.ok(SuccessResponse.of(successMessage, result.data()));
  }
}