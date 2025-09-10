package com.mango.backend.global.common;

import static com.mango.backend.global.common.api.ResponseStatus.FAIL;

import com.mango.backend.global.common.api.BaseResponse;
import com.mango.backend.global.common.api.ErrorResponse;
import org.springframework.http.ResponseEntity;

public abstract class BaseController {

  protected <T extends BaseResponse> ResponseEntity<T> wrapResponse(T response) {
    if (response.getStatus() == FAIL && response instanceof ErrorResponse error) {
      return ResponseEntity.status(error.getErrorCode().getStatus()).body(response);
    }
    return ResponseEntity.ok(response);
  }
}