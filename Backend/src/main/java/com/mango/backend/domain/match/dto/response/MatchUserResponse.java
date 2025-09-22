package com.mango.backend.domain.match.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MatchUserResponse(
        @JsonProperty("user_id")
        Long userId,
        @JsonProperty("matching_rank")
        Long matchingRank,
        @JsonProperty("matching_percent")
        int matchingPercent
) {
}
