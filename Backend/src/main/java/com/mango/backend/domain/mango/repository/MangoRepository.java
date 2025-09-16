package com.mango.backend.domain.mango.repository;

import com.mango.backend.domain.mango.entity.Mango;
import com.mango.backend.domain.user.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MangoRepository extends JpaRepository<Mango, Long> {

  // 내가 망고한 사람들 (userId 기준)
  @Query("""
          SELECT u FROM Mango m
          JOIN m.to u
          LEFT JOIN FETCH u.profilePhoto
          WHERE m.from.id = :userId
      """)
  List<User> findUsersILikedWithProfile(Long userId);

  // 나를 망고한 사람들 (userId 기준)
  @Query("""
          SELECT u FROM Mango m
          JOIN m.from u
          LEFT JOIN FETCH u.profilePhoto
          WHERE m.to.id = :userId
      """)
  List<User> findUsersWhoLikedMeWithProfile(Long userId);

}
