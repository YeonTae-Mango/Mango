package com.mango.backend.domain.mango.repository;

import com.mango.backend.domain.mango.entity.Mango;
import com.mango.backend.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MangoRepository extends JpaRepository<Mango, Long> {

  // 내가 망고한 사람들 (userId 기준, 페이징)
  @Query("""
          SELECT u FROM Mango m
          JOIN m.to u
          LEFT JOIN FETCH u.profilePhoto
          WHERE m.from.id = :userId
      """)
  Page<User> findUsersILikedWithProfile(Long userId, Pageable pageable);

  // 나를 망고한 사람들 (userId 기준, 페이징)
  @Query("""
          SELECT u FROM Mango m
          JOIN m.from u
          LEFT JOIN FETCH u.profilePhoto
          WHERE m.to.id = :userId
      """)
  Page<User> findUsersWhoLikedMeWithProfile(Long userId, Pageable pageable);
}

