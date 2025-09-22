package com.mango.backend.domain.userphoto.service;

import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.domain.userphoto.dto.response.UserPhotoResponse;
import com.mango.backend.domain.userphoto.entity.UserPhoto;
import com.mango.backend.domain.userphoto.repository.UserPhotoRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import com.mango.backend.global.util.FileUtil;
import com.mango.backend.global.util.JwtProvider;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserPhotoService {

  private final UserRepository userRepository;
  private final UserPhotoRepository userPhotoRepository;
  private final JwtProvider jwtProvider;
  private final FileUtil fileUtil;

  @Transactional(readOnly = true)
  public ServiceResult<List<UserPhotoResponse>> getUserPhotos(Long userId) {
    return userRepository.findById(userId)
        .map(user -> {
          List<UserPhotoResponse> photos = userPhotoRepository.findByUserOrderByPhotoOrderAsc(user)
              .stream()
              .map(photo -> new UserPhotoResponse(
                  photo.getId(),
                  photo.getPhotoUrl(), // 실제 URL 변환 로직 필요하면 추가
                  photo.getPhotoOrder()
              ))
              .collect(Collectors.toList());

          return ServiceResult.success(photos);
        })
        .orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));
  }

  @Transactional
  public ServiceResult<List<String>> uploadPhoto(Long requestId,
      List<MultipartFile> files) {
    if (files.size() > 4) {
      return ServiceResult.failure(ErrorCode.FILE_TOO_MANY);
    }
    if (files.isEmpty()) {
      return ServiceResult.failure(ErrorCode.FILE_TOO_LITTLE);
    }
    return userRepository.findById(requestId)
        .map(user -> {
          List<UserPhoto> photosToSave = new ArrayList<>();
          List<String> uploadedUrls = new ArrayList<>();
          byte order = 1;

          for (MultipartFile file : files) {
            String url;
            try {
              url = fileUtil.saveFile(file, "profile");
            } catch (IOException e) {
              throw new RuntimeException(e);
            }

            UserPhoto photo = UserPhoto.builder()
                .user(user)
                .photoUrl(url)
                .photoOrder(order++)
                .build();

            if (order == 2) { // 첫 번째 사진이면 대표 사진
              user.updateProfilePhoto(photo);
            }

            photosToSave.add(photo);
            uploadedUrls.add(url);
          }

          userPhotoRepository.saveAll(photosToSave);
          return ServiceResult.success(uploadedUrls);
        })
        .orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));
  }

  @Transactional
  public ServiceResult<Map<String, Long>> deletePhoto(String token, Long requestId, Long photoId) {
    Long userId = jwtProvider.getUserIdFromToken(token);
    if (!requestId.equals(userId)) {
      return ServiceResult.failure(ErrorCode.AUTH_FORBIDDEN);
    }

    return userPhotoRepository.findById(photoId)
        .map(photo -> {
          if (!photo.getUser().getId().equals(requestId)) {
            return ServiceResult.<Map<String, Long>>failure(ErrorCode.AUTH_FORBIDDEN);
          }

          userPhotoRepository.delete(photo);

          Map<String, Long> result = Map.of("deletedPhotoId", photo.getId());
          return ServiceResult.success(result);
        })
        .orElse(ServiceResult.failure(ErrorCode.FILE_NOT_FOUND));
  }
}
