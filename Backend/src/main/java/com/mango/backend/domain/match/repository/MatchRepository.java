package com.mango.backend.domain.match.repository;

import com.mango.backend.domain.match.entity.Match;
import com.mango.backend.domain.user.entity.User;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

  List<Match> findAllByUserOrUserId2(User user, User userId2);

  @Query("""
      select case 
               when m.user.id = :userId then m.userId2.id
               else m.user.id
             end
      from Match m
      where m.user.id = :userId or m.userId2.id = :userId
      """)
  Set<Long> findMatchedUserIdsByUserId(@Param("userId") Long userId);
}
