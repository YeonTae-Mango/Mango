package com.mango.backend.domain.auth.dto.request;

public record SignUpRequest(
    String email,
    String nickname,
    String birthDate, // 문자열로 받아서 LocalDate 변환
    String gender,
    Double latitude,
    Double longitude,
    String sigungu,
    Integer distance
) {

}
