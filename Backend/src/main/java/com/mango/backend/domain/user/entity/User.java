package com.mango.backend.domain.user.entity;

import com.mango.backend.domain.user.dto.request.UserUpdateRequest;
import com.mango.backend.domain.userphoto.entity.UserPhoto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
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

  @Column(name = "gender", nullable = false, length = 10) // 남자 : M, 여자 : F
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

  @Column(name = "location", columnDefinition = "POINT SRID 4326", nullable = false)
  private Point location;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "profile_photo_id")
  private UserPhoto profilePhoto;

  public void updateProfile(UserUpdateRequest request) {
    if (request.nickname() != null) {
      this.nickname = request.nickname();
    }
    if (request.sigungu() != null) {
      this.sigungu = request.sigungu();
    }
    if (request.distance() != null) {
      this.distance = request.distance();
    }
    if (request.introduction() != null) {
      this.introduction = request.introduction();
    }

    if (request.latitude() != null && request.longitude() != null) {
      GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

      // 기존 위치가 없으면 바로 갱신
      if (this.location == null) {
        this.location = geometryFactory.createPoint(
            new Coordinate(request.longitude(), request.latitude()));
      } else {
        double distanceKm = distanceInKm(
            this.location.getY(), this.location.getX(),
            request.latitude(), request.longitude());

        // 1km 이상일 때만 갱신
        if (distanceKm >= 1.0) {
          this.location = geometryFactory.createPoint(
              new Coordinate(request.longitude(), request.latitude()));
        }
      }
    }

    this.lastSyncAt = LocalDateTime.now();
  }

  public int getAge() {
    return Period.between(this.birthDate, LocalDate.now()).getYears();
  }

  public void updateProfilePhoto(UserPhoto userPhoto) {
    this.profilePhoto = userPhoto;
  }

  public double distanceInKm(double lat1, double lon1, double lat2, double lon2) {
    final int R = 6371; // 지구 반경 (km)
    double dLat = Math.toRadians(lat2 - lat1);
    double dLon = Math.toRadians(lon2 - lon1);
    double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
