package com.mango.backend.domain.block.repository;

import com.mango.backend.domain.block.entity.Block;
import com.mango.backend.domain.user.entity.User;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BlockRepository extends JpaRepository<Block, Long> {

  // 특정 사용자가 차단한 유저 목록 조회 (엔티티 전체)
  List<Block> findByFrom(User from);

  // 특정 사용자가 특정 유저를 차단했는지 여부 확인
  Optional<Block> findByFromAndTo(User from, User to);

  // 특정 사용자가 차단한 유저 삭제
  void deleteByFromAndTo(User from, User to);

  // 내가 차단한 사람 수
  long countByFrom(User from);

  // 나를 차단한 사람 수
  long countByTo(User to);

  // 특정 사용자가 차단한 유저들의 ID 목록
  @Query("select b.to.id from Block b where b.from.id = :userId")
  Set<Long> findBlockedUserIdsByUserId(@Param("userId") Long userId);

  // 특정 사용자를 차단한 유저들의 ID 목록 (역방향)
  @Query("select b.from.id from Block b where b.to.id = :userId")
  Set<Long> findUserIdsWhoBlockedMe(@Param("userId") Long userId);
}
