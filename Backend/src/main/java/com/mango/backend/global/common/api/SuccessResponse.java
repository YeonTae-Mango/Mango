package com.mango.backend.global.common.api;


import static com.mango.backend.global.common.api.ResponseStatus.SUCCESS;

import lombok.Getter;

@Getter
public class SuccessResponse<T> extends BaseResponse {

  private final T data;

  private SuccessResponse(String message, T data) {
    super(SUCCESS, message);
    this.data = data;
  }

  public static <T> SuccessResponse<T> of(String message, T data) {
    return new SuccessResponse<>(message, data);
  }
}