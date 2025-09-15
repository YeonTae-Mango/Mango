package com.mango.backend.domain.auth.dto.request;

public record LoginRequest(
    String email,
    String password
) {

}
