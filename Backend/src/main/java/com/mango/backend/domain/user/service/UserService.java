package com.mango.backend.domain.user.service;

import com.mango.backend.domain.consumptionpattern.entity.ConsumptionPattern;
import com.mango.backend.domain.consumptionpattern.repository.ConsumptionPatternRepository;
import com.mango.backend.domain.mango.repository.MangoRepository;
import com.mango.backend.domain.user.dto.request.UserUpdateRequest;
import com.mango.backend.domain.user.dto.response.MyInfoResponse;
import com.mango.backend.domain.user.dto.response.UserInfoResponse;
import com.mango.backend.domain.user.dto.response.UserUpdateResponse;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.domain.userphoto.entity.UserPhoto;
import com.mango.backend.domain.userphoto.repository.UserPhotoRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.FileUtil;
import com.mango.backend.global.util.JwtProvider;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final UserPhotoRepository userPhotoRepository;
  private final ConsumptionPatternRepository consumptionPatternRepository;
  private final MangoRepository mangoRepository;
  private final FileUtil fileUtil;
  private final RedisTemplate<String, String> redisTemplate;
  private final JwtProvider jwtProvider;

  @Transactional
  public ServiceResult<Void> deleteUser(Long requestId, String token) {

    Long userId = jwtProvider.getUserIdFromToken(token);
    if (!userId.equals(requestId)) {
      return ServiceResult.failure(ErrorCode.AUTH_FORBIDDEN);
    }

    return userRepository.findById(requestId)
        .map(user -> {
          userRepository.delete(user);
          redisTemplate.delete("JWT:" + requestId);
          return ServiceResult.<Void>success(null);
        })
        .orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));
  }

  public ServiceResult<?> getUserById(Long userId, String token) {
    Long myId = jwtProvider.getUserIdFromToken(token);

    User me = userRepository.findById(myId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
    ConsumptionPattern consumptionPattern = consumptionPatternRepository.findFirstByUserIdOrderByEndDateDesc(userId);

    if(consumptionPattern==null){
        return ServiceResult.failure(ErrorCode.NO_CONSUMPTION_PATTERNS);
    }

    String mainType = consumptionPattern.getMainType().getFirst().getName();
    List<String> keywords = new ArrayList<>();
    for(int i=0; i<3; i++){
      keywords.add(consumptionPattern.getKeyword().get(i).getName());
    }
    String food = consumptionPattern.getFood().getFirst().getName();

    List<String> profileImageUrls = userPhotoRepository
            .findByUserOrderByPhotoOrderAsc(user)
            .stream()
            .map(photo -> photo.getPhotoUrl())
            .toList();
    boolean theyLiked = mangoRepository.existsByFromAndTo(user, me);
    int distanceBetweenMe =0;
    if(me.getId().equals(userId)){
      distanceBetweenMe = calculateDistance(me, user);

    }

    UserInfoResponse response = UserInfoResponse.of(user,distanceBetweenMe,mainType,keywords,food,profileImageUrls, theyLiked);
    return ServiceResult.success(response);
    }

  @Transactional
  public ServiceResult<UserUpdateResponse> updateUser(Long requestId, String token,
      UserUpdateRequest request) {

    Long userId = jwtProvider.getUserIdFromToken(token);

    if (!requestId.equals(userId)) {
      return ServiceResult.failure(ErrorCode.AUTH_FORBIDDEN);
    }

    // 닉네임 검증
    String nickname = request.nickname();
    if (nickname == null || nickname.isBlank() || nickname.length() > 10) {
      return ServiceResult.failure(ErrorCode.USER_NICKNAME_LENGTH);
    }

    List<MultipartFile> newFiles = request.photos();
    if (newFiles.size() > 4) {
      return ServiceResult.failure(ErrorCode.FILE_TOO_MANY);
    }
    if (newFiles.isEmpty()) {
      return ServiceResult.failure(ErrorCode.FILE_TOO_LITTLE);
    }
    return userRepository.findById(requestId)
        .map(user -> {
          user.updateProfile(request);

          // 기존 사진 삭제
          List<UserPhoto> existingPhotos = userPhotoRepository.findByUserOrderByPhotoOrderAsc(user);
          for (UserPhoto photo : existingPhotos) {
            try {
              fileUtil.deleteFile(photo.getPhotoUrl(), "profile");
            } catch (IOException e) {
              log.warn("기존 파일 삭제 실패: {}", photo.getPhotoUrl(), e);
            }
          }
          userPhotoRepository.deleteAll(existingPhotos);

          // 새 사진 저장 및 매핑
          for (int i = 0; i < newFiles.size(); i++) {
            MultipartFile file = newFiles.get(i);
            String url;
            try {
              url = fileUtil.saveFile(file, "profile");
            } catch (IOException e) {
              throw new RuntimeException("사진 저장 실패", e);
            }

            UserPhoto newPhoto = UserPhoto.builder()
                .user(user)
                .photoUrl(url)
                .photoOrder((byte) (i + 1))
                .build();

            userPhotoRepository.save(newPhoto);

            // 1번 사진은 대표 프로필
            if (i == 0) {
              user.updateProfilePhoto(newPhoto);
            }
          }

          return ServiceResult.success(UserUpdateResponse.fromEntity(user));
        })
        .orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));
  }

  private int calculateDistance(User me, User other) {
    if (me.getLocation() == null || other.getLocation() == null) {
      return -1; // 위치 정보 없음
    }

    double lat1 = me.getLocation().getY(); // latitude
    double lon1 = me.getLocation().getX(); // longitude
    double lat2 = other.getLocation().getY();
    double lon2 = other.getLocation().getX();

    log.info("Calculating distance between ({}, {}) and ({}, {})", lat1, lon1, lat2, lon2);

    // User 엔티티에 있는 distanceInKm 메서드 사용
    double distanceKm = me.distanceInKm(lat1, lon1, lat2, lon2);

    return (int) Math.round(distanceKm);
  }
}