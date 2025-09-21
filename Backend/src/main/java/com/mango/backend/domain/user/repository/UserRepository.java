package com.mango.backend.domain.user.repository;

import com.mango.backend.domain.user.dto.projection.UserWithMango;
import com.mango.backend.domain.user.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);

  @Query("""
          SELECT u AS target,
                 requester AS me,
                 mFrom AS iLiked,
                 mTo AS theyLiked
          FROM User u
          JOIN User requester ON requester.id = :requestId
          LEFT JOIN Mango mFrom ON mFrom.from.id = :requestId AND mFrom.to.id = u.id
          LEFT JOIN Mango mTo   ON mTo.from.id = u.id AND mTo.to.id = :requestId
          WHERE u.id = :targetId
      """)
  Optional<UserWithMango> findUserWithMangoStatus(
      @Param("requestId") Long requestId,
      @Param("targetId") Long targetId);

  @Query(value = """
    SELECT u.*
    FROM users u
    WHERE u.location IS NOT NULL
    AND ST_Distance_Sphere(
          u.location,
          ST_GeomFromText(CONCAT('POINT(', :longitude, ' ', :latitude, ')'), 4326)
        ) <= :distance * 1000
    ORDER BY ST_Distance_Sphere(
          u.location,
          ST_GeomFromText(CONCAT('POINT(', :longitude, ' ', :latitude, ')'), 4326)
        )
    """,
          nativeQuery = true)
  List<User> findNearbyUsers(
          @Param("longitude") Double longitude,
          @Param("latitude") Double latitude,
          @Param("distance") Integer distance);

}

