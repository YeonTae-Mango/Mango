package com.mango.backend.domain.user.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

@Builder
public record UserUpdateRequest(

    @NotNull String nickname,
    @NotNull Double longitude,
    @NotNull Double latitude,
    @NotNull String sigungu,
    @NotNull Integer distance,
    @NotNull String introduction,
    @NotNull Long profilePhotoId,
    List<MultipartFile> photos
) {

  public static UserUpdateRequest of(
      String nickname,
      Double longitude,
      Double latitude,
      String sigungu,
      Integer distance,
      String introduction,
      Long profilePhotoId,
      List<MultipartFile> photos

  ) {
    return UserUpdateRequest.builder()
        .nickname(nickname)
        .longitude(longitude)
        .latitude(latitude)
        .sigungu(sigungu)
        .distance(distance)
        .introduction(introduction)
        .profilePhotoId(profilePhotoId)
        .photos(photos)
        .build();
  }

  public static UserUpdateRequest of(UserUpdateRequest req, List<MultipartFile> photos) {
    return of(
        req.nickname(),
        req.longitude(),
        req.latitude(),
        req.sigungu(),
        req.distance(),
        req.introduction(),
        req.profilePhotoId(),
        photos
    );
  }
}
