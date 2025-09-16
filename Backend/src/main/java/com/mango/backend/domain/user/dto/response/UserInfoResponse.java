package com.mango.backend.domain.user.dto.response;

import com.mango.backend.domain.user.entity.User;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserInfoResponse(
    String email,
    String nickname,
    LocalDate birthDate,
    Integer age,
    String gender,
    String latitude,
    String longitude,
    String sigungu,
    Integer distance,
    String introduction,
    LocalDateTime last_sync_at,
    Integer distanceBetweenMe,
    String mangoStatus
) {

  public static UserInfoResponse fromEntity(User user, Integer distanceBetweenMe,
      String mangoStatus) {
    String latitude = null;
    String longitude = null;
    if (user.getLocation() != null) {
      latitude = String.valueOf(user.getLocation().getY());
      longitude = String.valueOf(user.getLocation().getX());
    }

    return new UserInfoResponse(
        user.getEmail(),
        user.getNickname(),
        user.getBirthDate(),
        user.getAge(),
        user.getGender(),
        latitude,
        longitude,
        user.getSigungu(),
        user.getDistance(),
        user.getIntroduction(),
        user.getLastSyncAt(),
        distanceBetweenMe,
        mangoStatus
    );
  }
}
