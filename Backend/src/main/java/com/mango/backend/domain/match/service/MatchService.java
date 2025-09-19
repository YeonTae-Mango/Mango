package com.mango.backend.domain.match.service;

import com.mango.backend.domain.block.repository.BlockRepository;
import com.mango.backend.domain.mango.repository.MangoRepository;
import com.mango.backend.domain.match.dto.response.UserSwipeResponse;
import com.mango.backend.domain.match.repository.MatchRepository;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.domain.visited.repository.VisitedRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.JwtProvider;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchService {

  private final MatchRepository matchRepository;
  private final UserRepository userRepository;
  private final VisitedRepository visitedRepository;
  private final BlockRepository blockRepository;
  private final MangoRepository mangoRepository; // 내가 좋아요 누른 사람 ID 조회용
  private final JwtProvider jwtProvider;

  // TODO 페이징 처리 필요
  //      로케이션 변경 시 재계산 필요
  //      찾고 싶은 범위 수정 시에도 재계산 필요
  //      모두 계산을 해놓고, 유저에 대한 리스트는 레디스에 저장 -> 레디스에 없다면 다시 계산 필요
  public ServiceResult<List<UserSwipeResponse>> getSwipeList(String token, Long requestId) {
    Long userId = jwtProvider.getUserIdFromToken(token);
    if (!userId.equals(requestId)) {
      return ServiceResult.failure(ErrorCode.AUTH_FORBIDDEN);
    }
    User me = userRepository.findById(userId).orElse(null);
    if (me == null) {
      return ServiceResult.failure(ErrorCode.USER_NOT_FOUND);
    }

    log.info("latitude = {}, longitude = {}", me.getLocation().getY(), me.getLocation().getX());

    List<User> nearbyUsers = userRepository.findNearbyUsers(
        me.getLocation().getY(), // latitude
        me.getLocation().getX(), // longitude
        me.getDistance()
    );

    Set<Long> visitedIds = visitedRepository.findVisitedUserIdsByUserId(userId);
    Set<Long> blockedIds = blockRepository.findBlockedUserIdsByUserId(userId);
    Set<Long> matchedIds = matchRepository.findMatchedUserIdsByUserId(userId);
    Set<Long> iLikedIds = mangoRepository.findILikedUserIds(userId);
    Set<Long> theyLikedIds = mangoRepository.findUsersWhoLikedMeIds(userId);
    List<UserSwipeResponse> result = nearbyUsers.stream()
        .filter(u -> !u.getId().equals(userId))          // 자기 자신 제외
        .filter(u -> !visitedIds.contains(u.getId()))    // 방문 제외
        .filter(u -> !blockedIds.contains(u.getId()))    // 차단 제외
        .filter(u -> !matchedIds.contains(u.getId()))    // 매칭 제외
        .filter(u -> !iLikedIds.contains(u.getId()))     // 이미 좋아요 누른 사람 제외
        .map(u -> {
          double distanceKm = me.distanceInKm(
              me.getLocation().getY(), me.getLocation().getX(),
              u.getLocation().getY(), u.getLocation().getX()
          );

          int distanceKmInt = (int) Math.round(distanceKm); // 정수 km로 변환
          boolean theyLiked = theyLikedIds.contains(u.getId());

          // id + 대분류(8개짜리) + 키워드(수량 제한 없음)를 AI 서버로 보내줘서
          // 궁합 검사를 한 값을 기준으로 재정렬 한다.
          // TODO : AI 서버와 연동 필요
          // ------------------------
          // 🔹 목데이터 (1개, 3개, 1개만)
          // ------------------------
          String mockMainType = "뷰티형";

          List<String> mockKeywords = List.of(
              "일반스포츠",
              "카페/디저트",
              "미용서비스"
          );

          String mockFood = "한식";
          // ------------------------

          return UserSwipeResponse.from(
              u,
              theyLiked,
              distanceKmInt,
              mockMainType,
              mockKeywords,
              mockFood
          );
        })
        .toList();

    return ServiceResult.success(result);
  }
}
