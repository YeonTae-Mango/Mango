package com.mango.backend.domain.auth.service;

import static java.time.LocalDateTime.now;

import com.mango.backend.domain.auth.dto.request.LoginRequest;
import com.mango.backend.domain.auth.dto.request.SignUpRequest;
import com.mango.backend.domain.auth.dto.response.LoginResponse;
import com.mango.backend.domain.auth.dto.response.SignUpResponse;
import com.mango.backend.domain.auth.repository.AuthRepository;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.global.common.api.BaseResponse;
import com.mango.backend.global.common.api.ErrorResponse;
import com.mango.backend.global.common.api.SuccessResponse;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.JwtProvider;
import java.time.Duration;
import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
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

  @Transactional
  public BaseResponse signUp(SignUpRequest request) {
    if (authRepository.existsByEmail(request.email())) {
      return ErrorResponse.of(ErrorCode.USER_INVALID_INPUT);
    }
    if (authRepository.existsByNickname(request.nickname())) {
      return ErrorResponse.of(ErrorCode.USER_INVALID_INPUT);
    }

    LocalDate birthDate = LocalDate.parse(request.birthDate());
    byte age = (byte) Period.between(birthDate, LocalDate.now()).getYears();

    GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    Point location = geometryFactory.createPoint(
        new Coordinate(request.longitude(), request.latitude())
    );

    User user = User.builder()
        .email(request.email())
        .nickname(request.nickname())
        .password(passwordEncoder.encode(request.password()))
        .birthDate(LocalDate.parse(request.birthDate()))
        .age(age)
        .gender(request.gender())
        .sigungu(request.sigungu())
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
    return SuccessResponse.of("회원가입에 성공했습니다.", response);
  }

  public BaseResponse login(LoginRequest request) {
    Optional<User> userOpt = authRepository.findByEmail(request.email());
    if (userOpt.isEmpty()) {
      return ErrorResponse.of(ErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    User user = userOpt.get();
    if (!passwordEncoder.matches(request.password(), user.getPassword())) {
      return ErrorResponse.of(ErrorCode.AUTH_INVALID_CREDENTIALS);
    }

    String token = jwtProvider.generateToken(user.getId());
    Duration expire = Duration.ofMillis(
        jwtProvider.getExpiration(token).getTime() - System.currentTimeMillis());
    redisTemplate.opsForValue().set("JWT:" + user.getId(), token, expire);
    log.info("JWT token stored in Redis for userId {}: {}", user.getId(), token);
    return SuccessResponse.of("로그인 성공했습니다.", LoginResponse.of(user.getId(), token));
  }

  public BaseResponse logout(String token) {
    Long userId = jwtProvider.getUserId(token);
    log.info("로그아웃 시도, userId: {}", userId);
    redisTemplate.delete("JWT:" + userId);
    log.info("로그아웃 성공, userId: {}", userId);
    return SuccessResponse.of("로그아웃이 완료되었습니다.", null);
  }

  public BaseResponse checkEmail(String email) {
    if (authRepository.existsByEmail(email)) {
      return ErrorResponse.of(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
    }
    return SuccessResponse.of("사용 가능한 이메일입니다.", null);
  }

  public BaseResponse checkNickname(String nickname) {
    if (authRepository.existsByNickname(nickname)) {
      return ErrorResponse.of(ErrorCode.USER_NICKNAME_ALREADY_EXISTS);
    }
    return SuccessResponse.of("사용 가능한 닉네임입니다.", null);
  }
}
