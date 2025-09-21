package com.mango.backend.domain.visited.dto.request;

public record VisitedRequest(
        Long fromUserId,
        Long toUserId
) {}
