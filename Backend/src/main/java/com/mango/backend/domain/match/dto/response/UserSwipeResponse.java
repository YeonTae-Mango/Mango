package com.mango.backend.domain.match.dto.response;

import com.mango.backend.domain.user.entity.User;
import java.util.List;

// TODO : 시군구 넣기
//        카테고리와 키워드를 받으면 그 내용도 추가해줘야함.
public record UserSwipeResponse(
    Long id,
    String nickname,
    String introduction,
    List<String> profileImageUrls,
    String sigungu,
    int age,
    int distance,
    boolean theyLiked,
    String mainType,
    List<String> keywords,
    String food

) {

  public static UserSwipeResponse from(User user, boolean theyLiked, int distanceKm,
      String mainType, List<String> keywords, String food, List<String> profileImageUrls) {

    // 사진이 없으면 빈 리스트로 처리
    List<String> photos = profileImageUrls != null ? profileImageUrls : List.of();

    return new UserSwipeResponse(
        user.getId(),
        user.getNickname(),
        user.getIntroduction(),
        photos,
        user.getSigungu(),
        user.getAge(),
        distanceKm,
        theyLiked,
        mainType,
        keywords,
        food
    );
  }
}
