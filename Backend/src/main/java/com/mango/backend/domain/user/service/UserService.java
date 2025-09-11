package com.mango.backend.domain.user.service;

import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
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

  @Transactional
  public ServiceResult<Boolean> deleteUser(Long userId) {
    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isEmpty()) {
      return ServiceResult.failure(ErrorCode.USER_INVALID_INPUT);
    }

    userRepository.delete(userOpt.get());
    String redisKey = "JWT:" + userId;
    redisTemplate.delete(redisKey);

    return ServiceResult.success(true);
  }

}