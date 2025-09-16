package com.mango.backend.domain.userphoto.dto.response;

public record UserPhotoResponse(
    Long id,
    String url,
    Byte photoOrder
) {

}
