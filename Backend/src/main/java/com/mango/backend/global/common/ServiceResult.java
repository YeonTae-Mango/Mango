package com.mango.backend.global.common;

import com.mango.backend.global.error.ErrorCode;

public record ServiceResult<T>(boolean success, T data, ErrorCode errorCode) {

  public static <T> ServiceResult<T> success(T data) {
    return new ServiceResult<>(true, data, null);
  }

  public static <T> ServiceResult<T> failure(ErrorCode errorCode) {
    return new ServiceResult<>(false, null, errorCode);
  }
}