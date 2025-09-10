package com.mango.backend.domain.auth.service;

import com.mango.backend.domain.auth.dto.request.LoginRequest;
import com.mango.backend.domain.auth.dto.request.SignUpRequest;
import com.mango.backend.domain.auth.repository.AuthRepository;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.global.common.api.BaseResponse;
import com.mango.backend.global.common.api.ErrorResponse;
import com.mango.backend.global.common.api.SuccessResponse;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.JwtProvider;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
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

    GeometryFactory geometryFactory = new GeometryFactory();
    Point location = geometryFactory.createPoint(
        new Coordinate(request.longitude(), request.latitude()));

    User user = User.builder()
        .email(request.email())
        .nickname(request.nickname())
        .birthDate(LocalDate.parse(request.birthDate()))
        .age(age)
        .gender(request.gender())
        .sigungu(request.sigungu())
        .distance(request.distance())
        .location(location)
        .lastSyncAt(LocalDateTime.now())
        .build();

    authRepository.save(user);

    return SuccessResponse.of("회원가입 성공", user);
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
    redisTemplate.opsForValue().set("JWT:" + user.getId(), token,
        jwtProvider.getExpiration(token).getTime() - System.currentTimeMillis());

    return SuccessResponse.of("로그인 성공", token);
  }

  public BaseResponse logout(String token) {
    Long userId = jwtProvider.getUserId(token);
    redisTemplate.delete("JWT:" + userId);
    return SuccessResponse.of("로그아웃 성공", null);
  }

  public BaseResponse checkEmail(String email) {
    if (authRepository.existsByEmail(email)) {
      return ErrorResponse.of(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
    }
    return SuccessResponse.of("사용 가능한 이메일", null);
  }

  public BaseResponse checkNickname(String nickname) {
    if (authRepository.existsByNickname(nickname)) {
      return ErrorResponse.of(ErrorCode.USER_NICKNAME_ALREADY_EXISTS);
    }
    return SuccessResponse.of("사용 가능한 닉네임", null);
  }
}
