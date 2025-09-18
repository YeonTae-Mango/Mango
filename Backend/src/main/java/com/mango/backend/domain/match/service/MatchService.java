package com.mango.backend.domain.match.service;

import com.mango.backend.domain.block.repository.BlockRepository;
import com.mango.backend.domain.match.repository.MatchRepository;
import com.mango.backend.domain.user.dto.response.UserInfoResponse;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.domain.visited.repository.VisitedRepository;
import com.mango.backend.global.common.ServiceResult;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MatchService {

  private final MatchRepository matchRepository;
  private final UserRepository userRepository;
  private final VisitedRepository visitedRepository;
  private final BlockRepository blockRepository;

  public ServiceResult<List<UserInfoResponse>> findNearbyUsers(String token, Double latitude,
      Double longitude,
      int page) {
    //TODO : 이미 조회한 사용자는 안보이게
    //       차단한 사용자는 보이지 않게
    //       매칭된 사용자는 보이지 않게
    //       가까운 사람 순
    //       해당 리스트를 뽑아서 AI 서버로 보내기
//    Pageable pageable = PageRequest.of(page, 10);
//
//    Page<User> userPage = matchRepository.findAllByDistanceFrom(latitude, longitude, pageable);
//
//    // 검색 결과 없을 때 -> 빈 리스트 반환
//    if (userPage.isEmpty()) {
//      return ServiceResult.success(List.of());
//    }
//
//    List<UserInfoResponse> responses = userPage.stream()
//        .map(UserInfoResponse::of)
//        .toList();

    return ServiceResult.success(null);
  }
}
