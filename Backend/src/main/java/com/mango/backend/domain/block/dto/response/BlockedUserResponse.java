package com.mango.backend.domain.block.dto.response;

import com.mango.backend.domain.user.entity.User;

public record BlockedUserResponse(
    Long id
) {

  public static BlockedUserResponse from(User user) {
    return new BlockedUserResponse(user.getId());
  }
}
