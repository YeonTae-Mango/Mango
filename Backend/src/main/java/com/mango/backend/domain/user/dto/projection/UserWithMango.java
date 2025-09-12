package com.mango.backend.domain.user.dto.projection;

import com.mango.backend.domain.mango.entity.Mango;
import com.mango.backend.domain.user.entity.User;

/**
 * User + Like 상태를 함께 조회하기 위한 Projection DTO
 */
public interface UserWithMango {

  User getUser();

  Mango getILiked();

  Mango getTheyLiked();

  default String getMangoStatus() {
    boolean iLiked = getILiked() != null;
    boolean theyLiked = getTheyLiked() != null;

    if (iLiked && theyLiked) {
      return "MUTUAL";
    }
    if (iLiked) {
      return "I_MANGO";
    }
    if (theyLiked) {
      return "THEY_MANGO";
    }
    return "NONE";
  }
}