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
import com.mango.backend.domain.userphoto.repository.UserPhotoRepository;
import com.mango.backend.domain.visited.repository.VisitedRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.FinAnalysisApiClient;
import com.mango.backend.global.util.JwtProvider;

import java.util.*;
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
    private final MangoRepository mangoRepository; // 내가 좋아요 누른 사람 ID 조회용\
    private final UserPhotoRepository userPhotoRepository;
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

        ConsumptionPattern myConsumptionPattern = consumptionPatternRepository.findFirstByUserIdOrderByEndDateDesc(me.getId());
        MyMatchUserDto myMatchUserDto = MyMatchUserDto.from(myConsumptionPattern);

        Set<Long> excludeIds = new HashSet<>();
        excludeIds.addAll(visitedRepository.findVisitedUserIdsByUserId(userId));
        excludeIds.addAll(blockRepository.findBlockedUserIdsByUserId(userId));
        excludeIds.addAll(matchRepository.findMatchedUserIdsByUserId(userId));
        excludeIds.addAll(mangoRepository.findILikedUserIds(userId));
        excludeIds.addAll(mangoRepository.findUsersWhoLikedMeIds(userId));

        List<User> filteredUsers = nearbyUsers.stream()
                .filter(u -> !excludeIds.contains(u.getId()))
                .toList();
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
        String uri = UriComponentsBuilder.fromPath("/ai-api/v1/match/user").toUriString();
        List<MatchUserResponse> matchUserResponse = restClient.post()
                .uri(uri)
                .body(matchUserRequest)
                .retrieve()
                .body(new ParameterizedTypeReference<List<MatchUserResponse>>() {
                });
        if (matchUserResponse == null || matchUserResponse.isEmpty()) {
            throw new RuntimeException("소비패턴기반 파트너 추천 서버에 문제가 생겼습니다.");
        }
        Map<Long, MatchUserResponse> matchResultMap = matchUserResponse.stream()
                .collect(Collectors.toMap(MatchUserResponse::userId, Function.identity()));

        Set<Long> theyLikedIds = mangoRepository.findUsersWhoLikedMeIds(userId);


        filteredUsers.stream().filter(user -> matchResultMap.containsKey(user.getId()))
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
                    List<String> profileImageUrls = userPhotoRepository
                            .findByUserOrderByPhotoOrderAsc(user)
                            .stream()
                            .map(photo -> photo.getPhotoUrl())
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
                });


        List<UserSwipeResponse> result = new ArrayList<>();
//        List<UserSwipeResponse> result = nearbyUsers.stream()
//                .filter(u -> !u.getId().equals(userId))          // 자기 자신 제외
//                .filter(u -> !visitedIds.contains(u.getId()))    // 방문 제외
//                .filter(u -> !blockedIds.contains(u.getId()))    // 차단 제외
//                .filter(u -> !matchedIds.contains(u.getId()))    // 매칭 제외
//                .filter(u -> !iLikedIds.contains(u.getId()))     // 이미 좋아요 누른 사람 제외
//                .map(user -> {
//                    double distanceKm = me.distanceInKm(
//                            me.getLocation().getY(), me.getLocation().getX(),
//                            user.getLocation().getY(), user.getLocation().getX()
//                    );
//
//                    int distanceKmInt = (int) Math.round(distanceKm); // 정수 km로 변환
//                    boolean theyLiked = theyLikedIds.contains(user.getId());
//
//
//                    consumptionPatternRepository.findFirstByUserIdOrderByEndDateDesc(user.getId());
//                    // id + 대분류(8개짜리) + 키워드(수량 제한 없음)를 AI 서버로 보내줘서
//                    // 궁합 검사를 한 값을 기준으로 재정렬 한다.
//                    // TODO : AI 서버와 연동 필요
//                    // ------------------------
//                    // 🔹 목데이터 (1개, 3개, 1개만)
//                    // ------------------------
//
//
//                    String mockMainType = "뷰티형";
//
//                    List<String> mockKeywords = List.of(
//                            "일반스포츠",
//                            "카페/디저트",
//                            "미용서비스"
//                    );
//
//                    String mockFood = "한식";
//                    // ------------------------
//
//                    List<String> profileImageUrls = userPhotoRepository.findByUserOrderByPhotoOrderAsc(user)
//                            .stream()
//                            .map(photo -> photo.getPhotoUrl())
//                            .toList();
//
//                    return UserSwipeResponse.from(
//                            user,
//                            theyLiked,
//                            distanceKmInt,
//                            mockMainType,
//                            mockKeywords,
//                            mockFood,
//                            profileImageUrls
//                    );
//                })
//                // category 필터 적용: category가 지정된 경우 mockMainType과 일치하는 것만 남김
//                .filter(resp -> category == null || category.equals(resp.mainType()))
//                .toList();

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
