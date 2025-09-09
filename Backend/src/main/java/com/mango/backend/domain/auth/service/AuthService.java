package com.mango.backend.domain.auth.service;

import com.mango.backend.domain.auth.dto.request.LoginRequest;
import com.mango.backend.domain.auth.dto.request.SignUpRequest;
import com.mango.backend.domain.auth.repository.AuthRepository;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.global.common.api.ApiResponse;
import com.mango.backend.global.common.api.ErrorResponse;
import com.mango.backend.global.common.api.SuccessResponse;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.JwtProvider;
import java.time.LocalDate;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
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
  public ApiResponse<?> signUp(SignUpRequest request) {
    if (authRepository.existsByEmail(request.email())) {
      return ErrorResponse.of(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
    }

    User user = User.builder()
        .email(request.email())
        .password(passwordEncoder.encode(request.password()))
        .nickname(request.nickname())
        .gender(request.gender())
        .birthDate(LocalDate.parse(request.birthDate()))
        .build();

    authRepository.save(user);

    return SuccessResponse.of("회원가입 성공", user);
  }

  public ApiResponse<?> login(LoginRequest request) {
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

  public ApiResponse<?> logout(String token) {
    Long userId = jwtProvider.getUserId(token);
    redisTemplate.delete("JWT:" + userId);
    return SuccessResponse.of("로그아웃 성공", null);
  }
}
