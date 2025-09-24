package com.mango.backend.domain.user.dto.request;

public record UserUpdateRequest(
        String nickname,
        Double longitude,
        Double latitude,
        String sido,
        String sigungu,
        Integer distance,
        String introduction
) {
    public String concatenateAddress() {
        return sido + " " + sigungu;
    }
}