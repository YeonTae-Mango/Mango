package com.mango.backend.domain.mango.service;

import com.mango.backend.domain.mango.dto.response.MangoUserResponse;
import com.mango.backend.domain.mango.repository.MangoRepository;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.global.common.ServiceResult;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MangoService {

  private final MangoRepository mangoRepository;

  public ServiceResult<List<MangoUserResponse>> getUsersILiked(Long userId, int page) {
    Pageable pageable = PageRequest.of(page, 10); // 10명씩
    Page<User> usersPage = mangoRepository.findUsersILikedWithProfile(userId, pageable);

    List<MangoUserResponse> response = usersPage.stream()
        .map(MangoUserResponse::from)
        .collect(Collectors.toList());

    return ServiceResult.success(response);
  }

  public ServiceResult<List<MangoUserResponse>> getUsersWhoLikedMe(Long userId, int page) {
    Pageable pageable = PageRequest.of(page, 10); // 10명씩
    Page<User> usersPage = mangoRepository.findUsersWhoLikedMeWithProfile(userId, pageable);

    List<MangoUserResponse> response = usersPage.stream()
        .map(MangoUserResponse::from)
        .collect(Collectors.toList());

    return ServiceResult.success(response);

  }
}
