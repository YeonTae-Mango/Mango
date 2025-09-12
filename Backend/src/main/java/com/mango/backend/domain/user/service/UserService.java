package com.mango.backend.domain.user.service;

import com.mango.backend.domain.user.dto.projection.UserWithMango;
import com.mango.backend.domain.user.dto.response.MyInfoResponse;
import com.mango.backend.domain.user.dto.response.UserInfoResponse;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.JwtProvider;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
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

  public ServiceResult<?> getUserById(Long userId, String token) {
    Long requestId = jwtProvider.getUserId(token);

    if (userId.equals(requestId)) {
      // 내 정보 조회
      log.info("내 정보 조회 : {}", userId);
      Optional<User> userOpt = userRepository.findById(userId);
      if (userOpt.isEmpty()) {
        return ServiceResult.failure(ErrorCode.USER_INVALID_INPUT);
      }

      MyInfoResponse response = MyInfoResponse.fromEntity(userOpt.get());
      return ServiceResult.success(response);

    } else {
      // 다른 사용자 조회
      log.info("타인 정보 조회 : {}", requestId);
      Optional<UserWithMango> userWithMangoOpt = userRepository.findUserWithMangoStatus(requestId,
          userId);

      if (userWithMangoOpt.isEmpty()) {
        return ServiceResult.failure(ErrorCode.USER_INVALID_INPUT);
      }

      UserWithMango userWithMango = userWithMangoOpt.get();
      User me = userWithMango.getMe();
      User target = userWithMango.getTarget();
      log.info("show user ID : {} / request ID : {}", me.getId(), target.getId());
      int distance = calculateDistance(me, target);
      String mangoStatus = userWithMango.getMangoStatus();
      UserInfoResponse response = UserInfoResponse.fromEntity(target, distance, mangoStatus);

      return ServiceResult.success(response);
    }
  }

  private int calculateDistance(User me, User other) {
    if (me.getLocation() == null || other.getLocation() == null) {
      return -1; // 위치 정보 없음
    }

    double lat1 = me.getLocation().getX();
    double lon1 = me.getLocation().getY();
    double lat2 = other.getLocation().getX();
    double lon2 = other.getLocation().getY();
    log.info("Calculating distance between ({}, {}) and ({}, {})", lat1, lon1, lat2, lon2);
    // 하버사인 공식 (단위: km)
    double R = 6371; // 지구 반경 (km)
    double dLat = Math.toRadians(lat2 - lat1);
    double dLon = Math.toRadians(lon2 - lon1);
    double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (int) Math.round(R * c);
  }
}