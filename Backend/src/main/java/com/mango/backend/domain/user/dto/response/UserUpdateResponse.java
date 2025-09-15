package com.mango.backend.domain.user.dto.response;

import com.mango.backend.domain.user.entity.User;
import java.time.LocalDateTime;

public record UserUpdateResponse(
    Long userId,
    LocalDateTime updatedAt) {

  public static UserUpdateResponse fromEntity(User user) {
    return new UserUpdateResponse(
        user.getId(),
        LocalDateTime.now()
    );
  }
}
