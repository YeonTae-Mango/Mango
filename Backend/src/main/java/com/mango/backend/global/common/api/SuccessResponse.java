package com.mango.backend.global.common.api;


import lombok.Getter;

@Getter
public class SuccessResponse<T> implements BaseResponse<T> {

  private final String message;
  private final T data;

  private SuccessResponse(String message, T data) {
    this.message = message;
    this.data = data;
  }

  public static <T> SuccessResponse<T> of(String message, T data) {
    return new SuccessResponse<>(message, data);
  }

  @Override
  public boolean isSuccess() {
    return true;
  }
}

