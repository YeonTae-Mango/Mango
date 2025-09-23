package com.mango.backend.domain.userphoto.service;

import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.domain.userphoto.dto.response.UploadPhotoResponse;
import com.mango.backend.domain.userphoto.dto.response.UserPhotoResponse;
import com.mango.backend.domain.userphoto.entity.UserPhoto;
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
    private final JwtProvider jwtProvider;
    private final FileUtil fileUtil;

    @Transactional(readOnly = true)
    public ServiceResult<List<UserPhotoResponse>> getUserPhotos(Long userId) {
        return userRepository.findByIdWithPhotos(userId)
                .map(user -> {
                    List<UserPhotoResponse> photos = user.getPhotos()
                            .stream()
                            .map(photo -> new UserPhotoResponse(
                                    photo.getId(),
                                    photo.getPhotoUrl(),
                                    photo.getPhotoOrder()
                            ))
                            .collect(Collectors.toList());

                    return ServiceResult.success(photos);
                })
                .orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public ServiceResult<List<UploadPhotoResponse>> uploadPhoto(Long requestId, List<MultipartFile> files) {
        if (files.size() > 4) {
            return ServiceResult.failure(ErrorCode.FILE_TOO_MANY);
        }
        if (files.isEmpty()) {
            return ServiceResult.failure(ErrorCode.FILE_TOO_LITTLE);
        }
        return userRepository.findByIdWithPhotos(requestId)
                .map(user -> {
                    if (user.getPhotoCount() + files.size() > 4) {
                        return ServiceResult.<List<UploadPhotoResponse>>failure(ErrorCode.FILE_TOO_MANY);
                    }

                    for (MultipartFile file : files) {
                        String url;
                        try {
                            url = fileUtil.saveFile(file, "profile");
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                        user.addPhoto(url);
                    }
                    userRepository.flush();
                    List<UserPhoto> recentPhotos = user.getPhotos()
                            .stream()
                            .skip(Math.max(0, user.getPhotos().size() - files.size()))
                            .toList();
                    List<UploadPhotoResponse> responses = recentPhotos.stream()
                            .map(UploadPhotoResponse::from)
                            .toList();
                    return ServiceResult.success(responses);
                }).orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public ServiceResult<Map<String, Long>> deletePhoto(String token, Long requestId, Long photoId) {
        Long userId = jwtProvider.getUserIdFromToken(token);
        if (!requestId.equals(userId)) {
            return ServiceResult.failure(ErrorCode.AUTH_FORBIDDEN);
        }

        return userRepository.findByIdWithPhotos(requestId)  // 변경
                .map(user -> {
                    UserPhoto photoToDelete = user.getPhotos()
                            .stream()
                            .filter(photo -> photo.getId().equals(photoId))
                            .findFirst()
                            .orElse(null);

                    if (photoToDelete == null) {
                        return ServiceResult.<Map<String, Long>>failure(ErrorCode.FILE_NOT_FOUND);
                    }

                    user.removePhoto(photoToDelete);

                    return ServiceResult.success(Map.of("deletedPhotoId", photoId));
                })
                .orElse(ServiceResult.failure(ErrorCode.USER_NOT_FOUND));
    }
}
