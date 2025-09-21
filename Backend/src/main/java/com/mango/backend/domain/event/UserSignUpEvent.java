package com.mango.backend.domain.event;

import com.mango.backend.domain.user.entity.User;
import java.time.LocalDate;

public record UserSignUpEvent(
    Long userId,
    String gender,
    LocalDate birthDate
) {

  public static UserSignUpEvent from(User user) {
    return new UserSignUpEvent(
        user.getId(),
        user.getGender(),
        user.getBirthDate()
    );
  }
}
