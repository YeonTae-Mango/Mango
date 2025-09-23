package com.mango.backend.domain.user.dto.response;

import com.mango.backend.domain.user.entity.User;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Slf4j
public record UserInfoResponse(
        Long userId,
        String email,
        String nickname,
        LocalDate birthDate,
        Integer age,
        String gender,
        String latitude,
        String longitude,
        String sido,
        String sigungu,
        Integer distance,
        String introduction,
        Integer distanceBetweenMe,
        boolean theyLiked,
        String mainType,
        List<String> keywords,
        String food,
        List<String> profileImageUrls
) {

    public static UserInfoResponse of(
            User user,
            Integer distanceBetweenMe,
            String mainType, List<String> keywords, String food,
            List<String> profileImageUrls,
            boolean theyLiked) {
        String latitude = null;
        String longitude = null;
        String sido = null;
        String sigungu = null;
        if (user.getLocation() != null) {
            latitude = String.valueOf(user.getLocation().getY());
            longitude = String.valueOf(user.getLocation().getX());
        }
        String[] location = user.getSigungu().split(" ");
        if (location.length != 2) {
            log.error("위치정보가 잘못들어왔습니다. : {}", user.getSigungu());
            sido = location[0];
            sigungu = location[0];
        } else {
            sido = location[0];
            sigungu = location[1];
        }


        return UserInfoResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .birthDate(user.getBirthDate())
                .age(user.getAge())
                .gender(user.getGender())
                .latitude(latitude)
                .longitude(longitude)
                .sido(sido)
                .sigungu(sigungu)
                .distance(user.getDistance())
                .introduction(user.getIntroduction())
                .distanceBetweenMe(distanceBetweenMe)
                .theyLiked(theyLiked)
                .mainType(mainType)
                .keywords(keywords)
                .food(food)
                .profileImageUrls(profileImageUrls)
                .build();
    }
}
