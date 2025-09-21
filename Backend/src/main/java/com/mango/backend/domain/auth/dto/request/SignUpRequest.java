package com.mango.backend.domain.auth.dto.request;

public record SignUpRequest(
    String email,
    String nickname,
    String password,
    String birthDate, // 문자열로 받아서 LocalDate 변환
    String gender, // 남자 : M, 여자 : F
    Double latitude,
    Double longitude,
    String sido,
    String sigungu,
    Integer distance
) {
    public String concatenateAddress() {
        return sido + " " + sigungu;
    }
}
