package com.mango.backend.domain.user.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record UserUpdateRequest(

        @NotNull String nickname,
        @NotNull Double longitude,
        @NotNull Double latitude,
        @NotNull String sido,
        @NotNull String sigungu,
        @NotNull Integer distance,
        @NotNull String introduction
) {

  public static UserUpdateRequest of(
          String nickname,
          Double longitude,
          Double latitude,
          String sido,
          String sigungu,
          Integer distance,
          String introduction
  ) {
    return UserUpdateRequest.builder()
            .nickname(nickname)
            .longitude(longitude)
            .latitude(latitude)
            .sido(sido)
            .sigungu(sigungu)
            .distance(distance)
            .introduction(introduction)
            .build();
  }

  public static UserUpdateRequest of(UserUpdateRequest req) {
    return of(
            req.nickname(),
            req.longitude(),
            req.latitude(),
            req.sido(),
            req.sigungu(),
            req.distance(),
            req.introduction()
    );
  }

  public String concatenateAddress() {
    return sido + " " + sigungu;
  }
}
