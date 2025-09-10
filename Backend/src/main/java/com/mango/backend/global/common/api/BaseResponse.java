package com.mango.backend.global.common.api;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BaseResponse {

  private ResponseStatus status;
  private String message;

  public BaseResponse(ResponseStatus status, String message) {
    this.status = status;
    this.message = message;
  }
}
