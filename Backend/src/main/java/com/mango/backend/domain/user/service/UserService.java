package com.mango.backend.domain.user.service;

import com.mango.backend.domain.user.dto.request.UserUpdateRequest;
import com.mango.backend.domain.user.dto.response.MyInfoResponse;
import com.mango.backend.domain.user.dto.response.UserInfoResponse;
import com.mango.backend.domain.user.dto.response.UserUpdateResponse;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.JwtProvider;
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

    Long requestId = jwtProvider.getUserIdFromToken(token);
    if (!userId.equals(requestId)) {
      return ServiceResult.failure(ErrorCode.AUTH_FORBIDDEN);
    }

    return userRepository.findById(userId)
        .map(user -> {
          userRepository.delete(user);
          redisTemplate.delete("JWT:" + userId);
          return ServiceResult.<Void>success(null);
        })
        .orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));
  }

  public ServiceResult<?> getUserById(Long userId, String token) {
    Long requestId = jwtProvider.getUserIdFromToken(token);

    if (userId.equals(requestId)) {
      // 내 정보 조회
      log.info("내 정보 조회 : {}", userId);

      return userRepository.findById(userId)
          .map(user -> ServiceResult.success(MyInfoResponse.fromEntity(user)))
          .orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));


    } else {
      log.info("타인 정보 조회 : {}", requestId);

      return userRepository.findUserWithMangoStatus(requestId, userId)
          .map(userWithMango -> {
            User me = userWithMango.getMe();
            User target = userWithMango.getTarget();
            int distance = calculateDistance(me, target);
            String mangoStatus = userWithMango.getMangoStatus();

            UserInfoResponse response = UserInfoResponse.fromEntity(target, distance, mangoStatus);
            return ServiceResult.success(response);
          })
          .orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));
    }
  }

  /**
   * 사용자 정보 수정
   */
  @Transactional
  public ServiceResult<UserUpdateResponse> updateUser(Long userId, String token,
      UserUpdateRequest request) {
    Long requestId = jwtProvider.getUserIdFromToken(token);

    if (!userId.equals(requestId)) {
      return ServiceResult.failure(ErrorCode.AUTH_FORBIDDEN);
    }

    String nickname = request.nickname();
    if (nickname == null || nickname.isBlank() || nickname.length() > 10) {
      return ServiceResult.failure(ErrorCode.USER_NICKNAME_LENGTH);
    }
    
    return userRepository.findById(userId)
        .map(user -> {
          user.updateProfile(request); // 엔티티에서 DTO 받아서 업데이트
          return ServiceResult.success(UserUpdateResponse.fromEntity(user));
        })
        .orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));
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