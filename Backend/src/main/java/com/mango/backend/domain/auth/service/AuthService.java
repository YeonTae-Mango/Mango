package com.mango.backend.domain.auth.service;

import static java.time.LocalDateTime.now;

import com.mango.backend.domain.auth.dto.request.LoginRequest;
import com.mango.backend.domain.auth.dto.request.SignUpRequest;
import com.mango.backend.domain.auth.dto.response.LoginResponse;
import com.mango.backend.domain.auth.dto.response.SignUpResponse;
import com.mango.backend.domain.auth.repository.AuthRepository;
import com.mango.backend.domain.event.UserSignUpEvent;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.JwtProvider;
import java.time.Duration;
import java.time.LocalDate;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class AuthService {

  private final AuthRepository authRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtProvider jwtProvider;
  private final RedisTemplate<String, String> redisTemplate;
  private final ApplicationEventPublisher eventPublisher;

  @Transactional
  public ServiceResult<SignUpResponse> signUp(SignUpRequest request) {
    if (authRepository.existsByEmail(request.email())) {
      return ServiceResult.failure(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
    }
    if (authRepository.existsByNickname(request.nickname())) {
      return ServiceResult.failure(ErrorCode.USER_NICKNAME_ALREADY_EXISTS);
    }

    LocalDate birthDate = LocalDate.parse(request.birthDate());

    double latitude = request.latitude();
    double longitude = request.longitude();

    if (latitude < -90 || latitude > 90) {
      return ServiceResult.failure(ErrorCode.USER_INVALID_INPUT);
    }
    if (longitude < -180 || longitude > 180) {
      return ServiceResult.failure(ErrorCode.USER_INVALID_INPUT);
    }

    GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    Point location = geometryFactory.createPoint(
            new Coordinate(longitude, latitude) // (lon, lat) 순서
    );

    User user = User.builder()
        .email(request.email())
        .nickname(request.nickname())
        .password(passwordEncoder.encode(request.password()))
        .birthDate(birthDate)
        .gender(request.gender())
        .sigungu(request.concatenateAddress())
        .distance(request.distance())
        .location(location)
        .lastSyncAt(now())
        .build();

    authRepository.save(user);

    SignUpResponse response = SignUpResponse.of(
        user.getId(),
        user.getEmail(),
        user.getNickname(),
        now()
    );

    eventPublisher.publishEvent(UserSignUpEvent.from(user));

    return ServiceResult.success(response);
  }

  public ServiceResult<LoginResponse> login(LoginRequest request) {
    Optional<User> userOpt = authRepository.findByEmail(request.email());
    if (userOpt.isEmpty()) {
      return ServiceResult.failure(ErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    User user = userOpt.get();
    if (!passwordEncoder.matches(request.password(), user.getPassword())) {
      return ServiceResult.failure(ErrorCode.AUTH_INVALID_CREDENTIALS);
    }
    // fcmToken 업데이트
    if (request.fcmToken() != null && !request.fcmToken().isBlank()) {
      user.updateFcmToken(request.fcmToken());
      authRepository.save(user);
    }
    // JWT 발급
    String token = jwtProvider.generateToken(user.getId());
    Duration expire = Duration.ofMillis(
        jwtProvider.getExpiration(token).getTime() - System.currentTimeMillis());
    redisTemplate.opsForValue().set("JWT:" + user.getId(), token, expire);
    log.info("JWT token stored in Redis for userId {}: {}", user.getId(), token);

    // 프로필 미설정 체크
    if (user.getProfilePhoto() == null) {
      return ServiceResult.failure(ErrorCode.AUTH_PROFILE_INCOMPLETE);
    }
    LoginResponse response = LoginResponse.of(user.getId(), token);
    return ServiceResult.success(response);
  }


  @Transactional
  public ServiceResult<Void> logout(String token) {
    Long userId = jwtProvider.getUserIdFromToken(token);
    log.info("로그아웃 시도, userId: {}", userId);
    redisTemplate.delete("JWT:" + userId);
    log.info("로그아웃 성공, userId: {}", userId);
    return ServiceResult.success(null);
  }

  public ServiceResult<Void> checkEmail(String email) {
    if (authRepository.existsByEmail(email)) {
      return ServiceResult.failure(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
    }
    return ServiceResult.success(null);
  }

  public ServiceResult<Void> checkNickname(String nickname) {
    if (authRepository.existsByNickname(nickname)) {
      return ServiceResult.failure(ErrorCode.USER_NICKNAME_ALREADY_EXISTS);
    }
    return ServiceResult.success(null);
  }
}
