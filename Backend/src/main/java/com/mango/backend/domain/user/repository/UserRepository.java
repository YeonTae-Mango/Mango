package com.mango.backend.domain.user.repository;

import com.mango.backend.domain.user.dto.projection.UserWithMango;
import com.mango.backend.domain.user.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
  Optional<UserWithMango> findUserWithMangoStatus(@Param("requestId") Long requestId,
      @Param("targetId") Long targetId);


  @Query("""
          SELECT u
          FROM User u
          WHERE u.id NOT IN :excludeIds
          ORDER BY distance(u.latitude, u.longitude, :lat, :lon)
      """)
  List<User> findAllByDistanceFrom(
      @Param("lat") Double lat,
      @Param("lon") Double lon,
      @Param("excludeIds") Set<Long> excludeIds
  );
}
