package com.mango.backend.domain.user.dto.request;

import java.util.List;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

@Builder
public record UserUpdateRequest(

    String nickname,
    Double longitude,
    Double latitude,
    String sigungu,
    Integer distance,
    String introduction,
    Long profilePhotoId,
    List<MultipartFile> photos,
    List<Byte> orders
) {

  public static UserUpdateRequest of(
      String nickname,
      Double longitude,
      Double latitude,
      String sigungu,
      Integer distance,
      String introduction,
      Long profilePhotoId,
      List<MultipartFile> photos,
      List<Byte> orders

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
        .orders(orders)
        .build();
  }

  public static UserUpdateRequest of(UserUpdateRequest req, List<MultipartFile> photos,
      List<Byte> orders) {
    return of(
        req.nickname(),
        req.longitude(),
        req.latitude(),
        req.sigungu(),
        req.distance(),
        req.introduction(),
        req.profilePhotoId(),
        photos,
        orders
    );
  }
}
