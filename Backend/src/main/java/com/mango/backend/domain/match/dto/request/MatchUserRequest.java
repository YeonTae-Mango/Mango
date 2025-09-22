package com.mango.backend.domain.match.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record MatchUserRequest(
        @JsonProperty("ref")
        MyMatchUserDto ref,
        @JsonProperty("candidates")
        List<CandidateMatchUserDto> candidates
) {

}


