package com.mango.backend.domain.user.dto.request;

import jakarta.validation.constraints.NotNull;

public record UserUpdateRequest(

    @NotNull String nickname,
    @NotNull Double longitude,
    @NotNull Double latitude,
    @NotNull String sigungu,
    @NotNull Integer distance,
    @NotNull String introduction
) {

}
