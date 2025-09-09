package com.mango.backend.domain.user.service;

import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.global.common.api.ApiResponse;
import com.mango.backend.global.common.api.ErrorResponse;
import com.mango.backend.global.common.api.SuccessResponse;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.JwtProvider;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final JwtProvider jwtProvider;
  private final RedisTemplate<String, User> redisTemplate;

  @Transactional
  public ApiResponse<?> deleteUser(Long userId) {
    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isEmpty()) {
      return ErrorResponse.of(ErrorCode.USER_INVALID_INPUT);
    }

    userRepository.delete(userOpt.get());
    return SuccessResponse.of("회원 탈퇴 성공", null);
  }

}