package com.mango.backend.domain.user.dto.response;

import com.mango.backend.domain.user.entity.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record MyInfoResponse(
    Long userId,
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
    LocalDateTime lastSyncAt,
    String mainType,
    List<String> keywords,
    String food
) {

  public static MyInfoResponse of(User user, String mainType, List<String> keywords,
      String food) {
    String latitude = null;
    String longitude = null;
    if (user.getLocation() != null) {
      latitude = String.valueOf(user.getLocation().getY()); // 위도
      longitude = String.valueOf(user.getLocation().getX()); // 경도
    }

    return new MyInfoResponse(
        user.getId(),
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
        mainType,
        keywords,
        food
    );
  }
}
