package com.mango.backend.domain.user.repository;

import com.mango.backend.domain.user.dto.projection.UserWithMango;
import com.mango.backend.domain.user.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);

  @Query("""
          SELECT u AS user,
                 mFrom AS iLiked,
                 mTo AS theyLiked
          FROM User u
          LEFT JOIN Mango mFrom ON mFrom.from.id = :requestId AND mFrom.to.id = u.id
          LEFT JOIN Mango mTo   ON mTo.from.id = u.id AND mTo.to.id = :requestId
          WHERE u.id = :targetId
      """)
  Optional<UserWithMango> findUserWithMangoStatus(@Param("requestId") Long requestId,
      @Param("targetId") Long targetId);

}
