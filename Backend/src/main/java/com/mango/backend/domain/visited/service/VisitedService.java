package com.mango.backend.domain.visited.service;

import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import com.mango.backend.domain.visited.entity.Visited;
import com.mango.backend.domain.visited.repository.VisitedRepository;
import com.mango.backend.global.common.ServiceResult;
import com.mango.backend.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class VisitedService {

    private final VisitedRepository visitedRepository;
    private final UserRepository userRepository;

    @Transactional
    public ServiceResult<Void> markVisited(Long fromUserId, Long toUserId) {
        User fromUser = userRepository.findById(fromUserId)
                .orElse(null);
        User toUser = userRepository.findById(toUserId)
                .orElse(null);

        if (fromUser == null || toUser == null) {
            return ServiceResult.failure(ErrorCode.USER_NOT_FOUND);
        }

        // 이미 방문했으면 그냥 성공 반환
        if (visitedRepository.existsByFromAndTo(fromUser, toUser)) {
            return ServiceResult.success(null);
        }

        Visited visited = Visited.builder()
                .from(fromUser)
                .to(toUser)
                .build();

        visitedRepository.save(visited);
        return ServiceResult.success(null);
    }
}
