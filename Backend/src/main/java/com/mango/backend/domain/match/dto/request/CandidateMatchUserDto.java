package com.mango.backend.domain.match.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mango.backend.domain.consumptionpattern.entity.ConsumptionPattern;
import com.mango.backend.domain.consumptionpattern.entity.KeywordItem;
import com.mango.backend.domain.consumptionpattern.entity.TypeItem;

import java.util.List;

public record CandidateMatchUserDto(
        @JsonProperty("user_id")
        Long userId,
        @JsonProperty("대표유형")
        List<TypeItem> mainType,
        @JsonProperty("키워드")
        List<KeywordItem> keywords
) {
    public static CandidateMatchUserDto from(ConsumptionPattern consumptionPattern) {
        return new CandidateMatchUserDto(
                consumptionPattern.getUserId(),
                consumptionPattern.getMainType(),
                consumptionPattern.getKeyword()
        );
    }
}