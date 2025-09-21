package com.mango.backend.domain.mango.service;

import com.mango.backend.domain.event.NotificationEvent;
import com.mango.backend.domain.mango.dto.response.MangoUserResponse;
import com.mango.backend.domain.mango.entity.Mango;
import com.mango.backend.domain.mango.repository.MangoRepository;
import com.mango.backend.domain.match.entity.Match;
import com.mango.backend.domain.match.repository.MatchRepository;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.global.common.ServiceResult;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.mango.backend.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
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
  private final UserRepository userRepository;
  private final MatchRepository matchRepository;
  private final ApplicationEventPublisher publisher;

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

  @Transactional
  public ServiceResult<Void> likeUser(Long fromUserId, Long toUserId) {
    if (fromUserId.equals(toUserId)) {
      return ServiceResult.failure(ErrorCode.USER_CANNOT_LIKE_SELF);
    }

    Optional<User> fromUserOpt = userRepository.findById(fromUserId);
    if (fromUserOpt.isEmpty()) {
      return ServiceResult.failure(ErrorCode.USER_NOT_FOUND);
    }

    Optional<User> toUserOpt = userRepository.findById(toUserId);
    if (toUserOpt.isEmpty()) {
      return ServiceResult.failure(ErrorCode.USER_NOT_FOUND);
    }

    User fromUser = fromUserOpt.get();
    User toUser = toUserOpt.get();

    boolean exists = mangoRepository.existsByFromAndTo(fromUser, toUser);
    if (exists) {
      return ServiceResult.failure(ErrorCode.USER_ALREADY_LIKED);
    }

    Mango mango = Mango.builder()
            .from(fromUser)
            .to(toUser)
            .build();

    mangoRepository.save(mango);

    boolean isMatched = mangoRepository.existsByFromAndTo(toUser, fromUser);
    if (isMatched) {
      Match match = Match.builder()
              .user(fromUser)
              .userId2(toUser)
              .build();
      matchRepository.save(match);

      // 매칭 알림 1회만 발송
      String fromMsg = toUser.getNickname() + "님과 매치되었습니다";
      String toMsg = fromUser.getNickname() + "님과 매치되었습니다";

      publisher.publishEvent(NotificationEvent.from(fromUser.getId(), "새로운 매칭이 있어요!", fromMsg));
      publisher.publishEvent(NotificationEvent.from(toUser.getId(), "새로운 매칭이 있어요!", toMsg));
    } else {
      // 매칭이 아니면 좋아요 알림만 발송
      publisher.publishEvent(NotificationEvent.from(
              toUser.getId(),
              "망고를 받았어요!",
              fromUser.getNickname() + "님이 나를 망고 했습니다"
      ));
    }
    return ServiceResult.success(null);
  }

}
