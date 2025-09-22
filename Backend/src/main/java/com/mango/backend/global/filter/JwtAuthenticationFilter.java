package com.mango.backend.global.filter;

import com.mango.backend.global.util.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtProvider jwtProvider;
  private final RedisTemplate<String, String> redisTemplate;

  @Override
  protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {

    String authHeader = request.getHeader("Authorization");

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7);
      log.info("Extracted JWT Token: {}", token);

      if (jwtProvider.validateToken(token)) {
        log.info("JWT Token is valid");
        Long userId = jwtProvider.getUserIdFromToken(token);
        log.info("Extracted userId from JWT: {}", userId);

        // Redis 체크: 로그아웃 된 토큰이면 인증 실패
        String storedToken = redisTemplate.opsForValue().get("JWT:" + userId);
        log.info("Token in Redis for user {}: {}", userId, storedToken.substring(0, 10));

        if (storedToken != null && storedToken.equals(token)) {
          // Spring Security 인증 객체 세팅
          UsernamePasswordAuthenticationToken authentication =
              new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
          SecurityContextHolder.getContext().setAuthentication(authentication);
          log.info("Authentication set in SecurityContext for userId {}", userId);
        } else {
          log.warn("Token mismatch or not found in Redis. Unauthorized access.");
          response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
          return;
        }
      } else {
        log.warn("Invalid JWT Token. Unauthorized access.");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
      }
    } else {
//      log.info("No Authorization header or it does not start with Bearer");
    }

    filterChain.doFilter(request, response);
  }
}
