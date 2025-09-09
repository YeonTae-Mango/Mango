package com.mango.backend.global.common.api;

public interface ApiResponse<T> {

  boolean isSuccess();

  String getMessage();
}
