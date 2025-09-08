package com.mango.backend.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id", nullable = false)
  private Long id;

  @Column(name = "email", nullable = false, length = 50, unique = true)
  private String email;

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "nickname", nullable = false, length = 20)
  private String nickname;

  @Column(name = "birth_date", nullable = false)
  private LocalDate birthDate;

  @Column(name = "age")
  private Byte age;

  @Column(name = "gender", nullable = false, length = 10)
  private String gender;

  @Column(name = "sigungu", length = 30)
  private String sigungu;

  @Column(name = "distance")
  private Integer distance;

  @Lob
  @Column(name = "introduction")
  private String introduction;

  @Column(name = "last_sync_at")
  private Instant lastSyncAt;

  @Column(name = "location", columnDefinition = "POINT SRID 4326")
  private Point location;
}
