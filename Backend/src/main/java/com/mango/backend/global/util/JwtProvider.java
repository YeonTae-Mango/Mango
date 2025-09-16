package com.mango.backend.global.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtProvider {

  private final SecretKey key;
  private final long validityInMilliseconds;

  public JwtProvider(
      @Value("${jwt.secret}") String secret,
      @Value("${jwt.expiration}") long validityInMilliseconds) {
    // Base64로 인코딩된 시크릿 키 디코딩
    this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    this.validityInMilliseconds = validityInMilliseconds;
  }

  public String generateToken(Long userId) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + validityInMilliseconds);

    return Jwts.builder().subject(String.valueOf(userId)).issuedAt(now).expiration(expiry)
        .signWith(key) // HS256 알고리즘은 Key에서 자동 추론
        .compact();
  }

  public Long getUserIdFromToken(String token) {
    log.info("token : {}", token);
    String parsed = token;
    if (parsed.startsWith("Bearer ")) {
      token = parsed.substring(7).trim();
    }
    String subject = Jwts.parser()
        .verifyWith(key)
        .build().parseSignedClaims(token).getPayload()
        .getSubject();
    log.info("getUserId: {}", subject);
    return Long.parseLong(subject);
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parser()
          .verifyWith(key)
          .build()
          .parseSignedClaims(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  public Date getExpiration(String token) {
    String parsed = token;
    if (parsed.startsWith("Bearer ")) {
      token = parsed.substring(7).trim();
    }
    Jws<Claims> claims = Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token);

    return claims.getPayload().getExpiration();
  }
}