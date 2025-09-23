package com.mango.backend.domain.user.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record UpdateDistanceRequest(
    @NotNull(message = "거리 설정값은 필수입니다")
    Integer distance
) {
}