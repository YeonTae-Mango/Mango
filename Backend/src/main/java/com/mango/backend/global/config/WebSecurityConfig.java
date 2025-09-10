package com.mango.backend.global.config;

import com.mango.backend.global.filter.JwtAuthenticationFilter;
import com.mango.backend.global.util.JwtProvider;
import lombok.RequiredArgsConstructor;
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
public class WebSecurityConfig {

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

  // ---------------- Local Profile ----------------
  @Bean
  @Profile({"local", "dev"})
  public SecurityFilterChain securityFilterChainLocalDev(HttpSecurity http) throws Exception {
    configureHttp(http, true); // Swagger 허용
    return http.build();
  }

  // ---------------- Prod Profile ----------------
  @Bean
  @Profile("prod")
  public SecurityFilterChain securityFilterChainProd(HttpSecurity http) throws Exception {
    configureHttp(http, false); // Swagger 허용 없음
    return http.build();
  }

  private void configureHttp(HttpSecurity http, boolean permitSwagger) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource))
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(authorize -> {
          if (permitSwagger) {
            authorize.requestMatchers(
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/swagger-resources/**",
                "/webjars/**"
            ).permitAll();
          }
          authorize.requestMatchers("/api/**").permitAll()
              .anyRequest().authenticated();
        })
        .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
  }
}

