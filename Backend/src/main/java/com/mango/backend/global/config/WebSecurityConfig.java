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

  private final CorsConfigurationSource corsConfigurationSource;
  private final JwtProvider jwtProvider;
  private final RedisTemplate<String, String> redisTemplate;

  // Local & Dev 화이트리스트
  private static final String[] AUTH_WHITE_LIST_LOCAL_DEV = {
      "/api/**",
      "/dev/api/**",
      "/v3/api-docs/**",
      "/swagger-ui/**",
      "/docs/**",
      "/actuator/**"
  };

  // Prod 화이트리스트
  private static final String[] AUTH_WHITE_LIST_PROD = {
      "/api/**",
      "/actuator/**"
  };

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public JwtAuthenticationFilter jwtAuthenticationFilter() {
    return new JwtAuthenticationFilter(jwtProvider, redisTemplate);
  }

  @Bean
  @Profile({"local", "dev"})
  public SecurityFilterChain securityFilterChainLocalDev(HttpSecurity http,
      JwtAuthenticationFilter jwtFilter) throws Exception {
    configureHttp(http, jwtFilter, AUTH_WHITE_LIST_LOCAL_DEV);
    return http.build();
  }

  @Bean
  @Profile("prod")
  public SecurityFilterChain securityFilterChainProd(HttpSecurity http,
      JwtAuthenticationFilter jwtFilter) throws Exception {
    configureHttp(http, jwtFilter, AUTH_WHITE_LIST_PROD);
    return http.build();
  }

  private void configureHttp(HttpSecurity http, JwtAuthenticationFilter jwtFilter,
      String[] authWhiteList) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> {
          authorize.requestMatchers(authWhiteList).permitAll()
              .anyRequest().authenticated();
        })
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
  }
}