package com.mango.backend.domain.user.service;

import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.global.common.ServiceResult;
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
  private final RedisTemplate<String, String> redisTemplate;
  private final JwtProvider jwtProvider;

  @Transactional
  public ServiceResult<Void> deleteUser(Long userId, String token) {

    Long requestId = jwtProvider.getUserId(token);
    if (!userId.equals(requestId)) {
      return ServiceResult.failure(ErrorCode.AUTH_FORBIDDEN);
    }

    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isEmpty()) {
      return ServiceResult.failure(ErrorCode.USER_INVALID_INPUT);
    }

    userRepository.delete(userOpt.get());
    String redisKey = "JWT:" + userId;
    redisTemplate.delete(redisKey);

    return ServiceResult.success(null);
  }
}