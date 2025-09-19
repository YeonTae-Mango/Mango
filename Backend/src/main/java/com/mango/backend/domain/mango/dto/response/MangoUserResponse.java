package com.mango.backend.domain.mango.dto.response;

import com.mango.backend.domain.user.entity.User;

public record MangoUserResponse(
    Long userId,
    String profileUrl,
    String nickname,
    int age,
    String sigungu
) {

  public static MangoUserResponse from(User user) {
    String profileUrl = user.getProfilePhoto() != null
        ? user.getProfilePhoto().getPhotoUrl()
        : null;

    return new MangoUserResponse(
        user.getId(),
        profileUrl,
        user.getNickname(),
        user.getAge(),
        user.getSigungu()
    );
  }
}
