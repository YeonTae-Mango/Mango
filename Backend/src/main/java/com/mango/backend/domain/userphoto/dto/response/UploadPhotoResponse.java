package com.mango.backend.domain.userphoto.dto.response;

import com.mango.backend.domain.userphoto.entity.UserPhoto;
import lombok.Builder;

@Builder
public record UploadPhotoResponse(
        Long photoId,
        String photoUrl
) {
    public static UploadPhotoResponse from(UserPhoto userPhoto) {
        return UploadPhotoResponse.builder()
                .photoId(userPhoto.getId())
                .photoUrl(userPhoto.getPhotoUrl())
                .build();
    }
}
