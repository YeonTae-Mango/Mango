package com.mango.backend.global.common;

import com.mango.backend.global.common.api.BaseResponse;
import com.mango.backend.global.common.api.ErrorResponse;
import org.springframework.http.ResponseEntity;

public abstract class BaseController {

  protected <T extends BaseResponse> ResponseEntity<T> wrapResponse(T response) {
    if (!response.isSuccess() && response instanceof ErrorResponse error) {
      return ResponseEntity.status(error.getStatus()).body(response);
    }
    return ResponseEntity.ok(response);
  }
}