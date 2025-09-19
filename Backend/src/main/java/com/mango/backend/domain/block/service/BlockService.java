package com.mango.backend.domain.block.service;

import com.mango.backend.domain.block.entity.Block;
import com.mango.backend.domain.block.repository.BlockRepository;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.JwtProvider;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BlockService {

  private final BlockRepository blockRepository;
  private final UserRepository userRepository;
  private final JwtProvider jwtProvider;

  /**
   * 특정 유저 차단
   */
  @Transactional
  public ServiceResult<Void> blockUser(Long requestId, Long targetUserId, String token) {
    // 토큰에서 내 userId 확인
    Long userIdFromToken = jwtProvider.getUserIdFromToken(token);
    if (!requestId.equals(userIdFromToken)) {
      return ServiceResult.failure(ErrorCode.AUTH_FORBIDDEN);
    }

    // 내 유저 조회
    User me = userRepository.findById(requestId)
        .orElse(null);
    if (me == null) {
      return ServiceResult.failure(ErrorCode.USER_NOT_FOUND);
    }

    // 차단 대상 유저 조회
    User target = userRepository.findById(targetUserId)
        .orElse(null);
    if (target == null) {
      return ServiceResult.failure(ErrorCode.USER_NOT_FOUND);
    }

    // 이미 차단했는지 확인
    if (blockRepository.findByFromAndTo(me, target).isPresent()) {
      return ServiceResult.failure(ErrorCode.USER_ALEADY_BLOCKED);
    }

    // 차단 생성
    Block block = Block.builder()
        .from(me)
        .to(target)
        .build();
    blockRepository.save(block);

    log.info("유저 {} 가 유저 {} 를 차단함", me.getId(), target.getId());
    return ServiceResult.success(null);
  }


  public ServiceResult<List<Long>> getBlockedUsers(Long requestId, String token) {
    Long userId = jwtProvider.getUserIdFromToken(token);

    if (!requestId.equals(userId)) {
      return ServiceResult.failure(ErrorCode.AUTH_FORBIDDEN);
    }

    User me = userRepository.findById(userId)
        .orElse(null);
    if (me == null) {
      return ServiceResult.failure(ErrorCode.USER_NOT_FOUND);
    }

    List<Long> blockedIds = blockRepository.findByFrom(me).stream()
        .map(block -> block.getTo().getId())
        .collect(Collectors.toList());

    return ServiceResult.success(blockedIds);
  }
}
