package com.mango.backend.domain.match.dto.response;

import com.mango.backend.domain.user.entity.User;

// TODO : 시군구 넣기
//        카테고리와 키워드를 받으면 그 내용도 추가해줘야함.
public record UserSwipeResponse(
    Long id,
    String nickname,
    String introduction,
    String profileImageUrl,
    int age,
    double distance,
    boolean theyLiked
) {

  public static UserSwipeResponse from(User user, boolean theyLiked, double distanceKm) {
    String profileUrl =
        user.getProfilePhoto() != null ? user.getProfilePhoto().getPhotoUrl() : null;

    return new UserSwipeResponse(
        user.getId(),
        user.getNickname(),
        user.getIntroduction(),
        profileUrl,
        user.getAge(),
        distanceKm,
        theyLiked
    );
  }
}
