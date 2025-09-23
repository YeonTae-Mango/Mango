package com.mango.backend.domain.match.service;

import com.mango.backend.domain.block.repository.BlockRepository;
import com.mango.backend.domain.consumptionpattern.entity.ConsumptionPattern;
import com.mango.backend.domain.consumptionpattern.repository.ConsumptionPatternRepository;
import com.mango.backend.domain.mango.repository.MangoRepository;
import com.mango.backend.domain.match.dto.request.CandidateMatchUserDto;
import com.mango.backend.domain.match.dto.request.MatchUserRequest;
import com.mango.backend.domain.match.dto.request.MyMatchUserDto;
import com.mango.backend.domain.match.dto.response.MatchUserResponse;
import com.mango.backend.domain.match.dto.response.UserSwipeResponse;
import com.mango.backend.domain.match.repository.MatchRepository;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.domain.userphoto.entity.UserPhoto;
import com.mango.backend.domain.visited.repository.VisitedRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.FinAnalysisApiClient;
import com.mango.backend.global.util.JwtProvider;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchService {

  private final MatchRepository matchRepository;
  private final UserRepository userRepository;
  private final VisitedRepository visitedRepository;
  private final BlockRepository blockRepository;
  private final MangoRepository mangoRepository;
  private final JwtProvider jwtProvider;
  private final ConsumptionPatternRepository consumptionPatternRepository;
  private final FinAnalysisApiClient finAnalysisApiClient;

  // TODO 페이징 처리 필요
  //      로케이션 변경 시 재계산 필요
  //      찾고 싶은 범위 수정 시에도 재계산 필요
  //      모두 계산을 해놓고, 유저에 대한 리스트는 레디스에 저장 -> 레디스에 없다면 다시 계산 필요
  public ServiceResult<List<UserSwipeResponse>> getSwipeList(String token, Long requestId,
      String category) {
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
        me.getDistance(),
        me.getGender()
    );
    log.info("nearbyUsers = {}", nearbyUsers);
    if (nearbyUsers == null || nearbyUsers.isEmpty()) {
      return ServiceResult.success(Collections.emptyList());
    }

    ConsumptionPattern myConsumptionPattern = consumptionPatternRepository.findFirstByUserIdOrderByEndDateDesc(
        me.getId());
    MyMatchUserDto myMatchUserDto = MyMatchUserDto.from(myConsumptionPattern);

    Set<Long> excludeIds = new HashSet<>();
    excludeIds.addAll(visitedRepository.findVisitedUserIdsByUserId(userId));
    excludeIds.addAll(blockRepository.findBlockedUserIdsByUserId(userId));
    excludeIds.addAll(matchRepository.findMatchedUserIdsByUserId(userId));
    excludeIds.addAll(mangoRepository.findILikedUserIds(userId));

    List<User> filteredUsers = nearbyUsers.stream()
        .filter(u -> !excludeIds.contains(u.getId()))
        .toList();
    List<Long> filteredUserIds = filteredUsers.stream()
            .map(User::getId)
            .toList();
    List<User> usersWithPhotos = userRepository.findUsersWithPhotos(filteredUserIds);
    Map<Long, ConsumptionPattern> consumptionPatternMap = new HashMap<>();
    List<CandidateMatchUserDto> candidateMatchUsers = new ArrayList<>();
    for (User u : filteredUsers) {
      ConsumptionPattern pattern = consumptionPatternRepository
          .findFirstByUserIdOrderByEndDateDesc(u.getId());
      consumptionPatternMap.put(u.getId(), pattern); // 저장해둠
      candidateMatchUsers.add(CandidateMatchUserDto.from(pattern));
    }

    MatchUserRequest matchUserRequest = new MatchUserRequest(myMatchUserDto, candidateMatchUsers);
    RestClient restClient = finAnalysisApiClient.createRestClient();
    String uri = UriComponentsBuilder.fromPath("/ai-api/v1/match/users").toUriString();
    log.info("필터링된 유저 수: {}", filteredUsers.size());
    log.info("후보 매칭 유저 수: {}", candidateMatchUsers.size());
    log.info("요청 URI: {}", uri);
    List<MatchUserResponse> matchUserResponse = new ArrayList<>();
    try {
      matchUserResponse = restClient.post()
          .uri(uri)
          .body(matchUserRequest)
          .retrieve()
          .body(new ParameterizedTypeReference<List<MatchUserResponse>>() {
          });

      log.info("매칭 응답: {}", matchUserResponse);
      log.info("응답 크기: {}", matchUserResponse != null ? matchUserResponse.size() : "null");

    } catch (Exception e) {
      log.error("외부 API 호출 실패", e);
      return ServiceResult.failure(ErrorCode.EXTERNAL_ERROR);
    }
    Map<Long, MatchUserResponse> matchResultMap = matchUserResponse.stream()
        .collect(Collectors.toMap(MatchUserResponse::userId, Function.identity()));

    Set<Long> theyLikedIds = mangoRepository.findUsersWhoLikedMeIds(userId);

    List<UserSwipeResponse> result = usersWithPhotos.stream()
        .filter(user -> matchResultMap.containsKey(user.getId()))
        .map(user -> {
          int distanceKm = (int) me.distanceInKm(
              me.getLocation().getY(), me.getLocation().getX(),
              user.getLocation().getY(), user.getLocation().getX()
          );
          boolean theyLiked = theyLikedIds.contains(user.getId());
          ConsumptionPattern userPattern = consumptionPatternMap.get(user.getId());
          String mainType = extractMainType(userPattern);
          List<String> keywords = extractKeywords(userPattern);
          String food = extractFood(userPattern);
          List<String> profileImageUrls = user.getPhotos()
                  .stream()
                  .map(UserPhoto::getPhotoUrl)
                  .toList();

          return UserSwipeResponse.from(
              user,
              theyLiked,
              distanceKm,
              mainType,
              keywords,
              food,
              profileImageUrls
          );
        })
        .sorted(Comparator.comparing(resp ->
            matchResultMap.get(resp.id()).matchingRank()))
        .filter(resp -> category == null || category.equals(resp.mainType()))
        .toList();
    return ServiceResult.success(result);
  }

  public ServiceResult<List<UserSwipeResponse>> getSwipeList2(Long requestId,
      String category) {
    Long userId = requestId;
    User me = userRepository.findById(userId).orElse(null);
    if (me == null) {
      return ServiceResult.failure(ErrorCode.USER_NOT_FOUND);
    }

    log.info("latitude = {}, longitude = {}", me.getLocation().getY(), me.getLocation().getX());

    List<User> nearbyUsers = userRepository.findNearbyUsers(
        me.getLocation().getY(), // latitude
        me.getLocation().getX(), // longitude
        me.getDistance(),
        me.getGender()
    );
    log.info("nearbyUsers = {}", nearbyUsers);
    if (nearbyUsers == null || nearbyUsers.isEmpty()) {
      return ServiceResult.success(Collections.emptyList());
    }

    ConsumptionPattern myConsumptionPattern = consumptionPatternRepository.findFirstByUserIdOrderByEndDateDesc(
        me.getId());
    MyMatchUserDto myMatchUserDto = MyMatchUserDto.from(myConsumptionPattern);

    Set<Long> excludeIds = new HashSet<>();
    excludeIds.addAll(visitedRepository.findVisitedUserIdsByUserId(userId));
    excludeIds.addAll(blockRepository.findBlockedUserIdsByUserId(userId));
    excludeIds.addAll(matchRepository.findMatchedUserIdsByUserId(userId));
    excludeIds.addAll(mangoRepository.findILikedUserIds(userId));

    List<User> filteredUsers = nearbyUsers.stream()
        .filter(u -> !excludeIds.contains(u.getId()))
        .toList();
    List<Long> filteredUserIds = filteredUsers.stream()
            .map(User::getId)
            .toList();
    List<User> usersWithPhotos = userRepository.findUsersWithPhotos(filteredUserIds);
    Map<Long, ConsumptionPattern> consumptionPatternMap = new HashMap<>();
    List<CandidateMatchUserDto> candidateMatchUsers = new ArrayList<>();
    for (User u : filteredUsers) {
      ConsumptionPattern pattern = consumptionPatternRepository
          .findFirstByUserIdOrderByEndDateDesc(u.getId());
      consumptionPatternMap.put(u.getId(), pattern); // 저장해둠
      candidateMatchUsers.add(CandidateMatchUserDto.from(pattern));
    }

    MatchUserRequest matchUserRequest = new MatchUserRequest(myMatchUserDto, candidateMatchUsers);
    RestClient restClient = finAnalysisApiClient.createRestClient();
    String uri = UriComponentsBuilder.fromPath("/ai-api/v1/match/users").toUriString();
    log.info("필터링된 유저 수: {}", filteredUsers.size());
    log.info("후보 매칭 유저 수: {}", candidateMatchUsers.size());
    log.info("요청 URI: {}", uri);
    List<MatchUserResponse> matchUserResponse = new ArrayList<>();
    try {
      matchUserResponse = restClient.post()
          .uri(uri)
          .body(matchUserRequest)
          .retrieve()
          .body(new ParameterizedTypeReference<List<MatchUserResponse>>() {
          });

      log.info("매칭 응답: {}", matchUserResponse);
      log.info("응답 크기: {}", matchUserResponse != null ? matchUserResponse.size() : "null");

    } catch (Exception e) {
      log.error("외부 API 호출 실패", e);
      return ServiceResult.failure(ErrorCode.EXTERNAL_ERROR);
    }
    Map<Long, MatchUserResponse> matchResultMap = matchUserResponse.stream()
        .collect(Collectors.toMap(MatchUserResponse::userId, Function.identity()));

    Set<Long> theyLikedIds = mangoRepository.findUsersWhoLikedMeIds(userId);

    List<UserSwipeResponse> result = usersWithPhotos.stream()
        .filter(user -> matchResultMap.containsKey(user.getId()))
        .map(user -> {
          int distanceKm = (int) me.distanceInKm(
              me.getLocation().getY(), me.getLocation().getX(),
              user.getLocation().getY(), user.getLocation().getX()
          );
          boolean theyLiked = theyLikedIds.contains(user.getId());
          ConsumptionPattern userPattern = consumptionPatternMap.get(user.getId());
          String mainType = extractMainType(userPattern);
          List<String> keywords = extractKeywords(userPattern);
          String food = extractFood(userPattern);
          List<String> profileImageUrls = user.getPhotos()
                  .stream()
                  .map(UserPhoto::getPhotoUrl)
                  .toList();

          return UserSwipeResponse.from(
              user,
              theyLiked,
              distanceKm,
              mainType,
              keywords,
              food,
              profileImageUrls
          );
        })
        .sorted(Comparator.comparing(resp ->
            matchResultMap.get(resp.id()).matchingRank()))
        .filter(resp -> category == null || category.equals(resp.mainType()))
        .toList();
    return ServiceResult.success(result);
  }

  private String extractMainType(ConsumptionPattern pattern) {
    return pattern != null ? pattern.getMainType().getFirst().getName() : "기타";
  }

  private List<String> extractKeywords(ConsumptionPattern pattern) {
    if (pattern == null) {
      return Collections.emptyList();
    }
    List<String> keywords = new ArrayList<>();
    for (int i = 0; i < 3; i++) {
      keywords.add(pattern.getKeyword().get(i).getName());
    }
    return keywords;
  }

  private String extractFood(ConsumptionPattern pattern) {
    return pattern != null ? pattern.getFood().getFirst().getName() : "기타";
  }
}
