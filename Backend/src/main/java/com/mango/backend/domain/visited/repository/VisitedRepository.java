package com.mango.backend.domain.visited.repository;

import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.visited.entity.Visited;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VisitedRepository extends JpaRepository<Visited, Long> {

  // 특정 from -> to 방문 기록 존재 여부
  boolean existsByFromAndTo(User from, User to);

  List<Visited> findAllByFrom(User from);

  // userId가 방문한(to_id) 사용자들의 ID 목록
  @Query("select v.to.id from Visited v where v.from.id = :userId")
  Set<Long> findVisitedUserIdsByUserId(@Param("userId") Long userId);

  // userId를 방문한(from_id) 사용자들의 ID 목록 (역방향)
  @Query("select v.from.id from Visited v where v.to.id = :userId")
  Set<Long> findVisitorUserIdsByUserId(@Param("userId") Long userId);
}