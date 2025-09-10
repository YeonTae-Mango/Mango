package com.mango.backend.global.config;

import com.mango.backend.global.filter.JwtAuthenticationFilter;
import com.mango.backend.global.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class WebSecurityConfig {

  private static final String[] AUTH_WHITE_LIST = {
      "/api/**",
      "/v3/api-docs/**",
      "/swagger-ui/**"
//      "/api/v1/auth/sign-up",
//      "/api/v1/auth/login",
//      "/api/v1/members/password",
//      "/api/v1/members",
//      "/actuator/health"
  };

  private final CorsConfigurationSource corsConfigurationSource;
  private final JwtProvider jwtProvider;
  private final RedisTemplate<String, String> redisTemplate;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public JwtAuthenticationFilter jwtAuthenticationFilter() {
    return new JwtAuthenticationFilter(jwtProvider, redisTemplate);
  }

  // ---------------- Local & Dev Profile ----------------
  @Bean
  @Profile({"local", "dev"})
  public SecurityFilterChain securityFilterChainLocalDev(HttpSecurity http,
      JwtAuthenticationFilter jwtFilter) throws Exception {
    configureHttp(http, jwtFilter, true);
    return http.build();
  }

  // ---------------- Prod Profile ----------------
  @Bean
  @Profile("prod")
  public SecurityFilterChain securityFilterChainProd(HttpSecurity http,
      JwtAuthenticationFilter jwtFilter) throws Exception {
    configureHttp(http, jwtFilter, true);
    return http.build();
  }

  private void configureHttp(HttpSecurity http, JwtAuthenticationFilter jwtFilter,
      boolean permitSwagger) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> {
          // Swagger 허용
          if (permitSwagger) {
            authorize.requestMatchers(
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/docs/**"
            ).permitAll();
          }

          // API 화이트리스트
          authorize.requestMatchers(AUTH_WHITE_LIST).permitAll()
              .anyRequest().authenticated();
        })
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
  }
}