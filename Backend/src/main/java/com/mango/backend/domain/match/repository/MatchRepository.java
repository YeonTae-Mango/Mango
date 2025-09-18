package com.mango.backend.domain.match.repository;

import com.mango.backend.domain.match.entity.Match;
import com.mango.backend.domain.user.entity.User;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<User, Long> {

  @Query(
      value = """
          SELECT u.*,
                 ST_Distance_Sphere(
                   u.location,
                   ST_GeomFromText(CONCAT('POINT(', :longitude, ' ', :latitude, ')'), 4326)
                 ) AS distance
          FROM users u
          WHERE u.location IS NOT NULL
          ORDER BY distance ASC
          """,
      countQuery = """
          SELECT COUNT(*)
          FROM users u
          WHERE u.location IS NOT NULL
          """,
      nativeQuery = true
  )
  Page<User> findAllByDistanceFrom(
      @Param("latitude") Double latitude,
      @Param("longitude") Double longitude,
      Pageable pageable
  );

  List<Match> findAllByUserOrUserId2(User user, User userId2);
}
