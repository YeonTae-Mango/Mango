package com.mango.backend.domain.user.entity;

import com.mango.backend.domain.user.dto.request.UserUpdateRequest;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

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
  private LocalDateTime lastSyncAt;

  @Column(name = "location", columnDefinition = "POINT SRID 4326")
  private Point location;

  public void updateProfile(UserUpdateRequest request) {
    if (nickname != null) {
      this.nickname = request.nickname();
    }
    if (sigungu != null) {
      this.sigungu = request.sigungu();
    }
    if (distance != null) {
      this.distance = request.distance();
    }
    if (introduction != null) {
      this.introduction = request.introduction();
    }

    // 위도/경도 값이 모두 있을 때만 location 갱신
    if (request.latitude() != null && request.longitude() != null) {
      GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
      this.location = geometryFactory.createPoint(
          new Coordinate(request.longitude(), request.latitude()));
    }

    this.lastSyncAt = LocalDateTime.now();
  }

  public void updateLocation(Double latitude, Double longitude) {
    if (latitude != null && longitude != null) {
      GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
      this.location = geometryFactory.createPoint(new Coordinate(longitude, latitude));
      this.lastSyncAt = LocalDateTime.now();
    }
  }

}
