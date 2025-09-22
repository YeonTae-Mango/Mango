package com.mango.backend.domain.chat.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 채팅방 생성 요청 DTO
 * 
 * === 언제 사용하나요? ===
 * - 사용자가 다른 사용자와 새로운 채팅을 시작하려고 할 때
 * - 이미 존재하는 채팅방이면 기존 채팅방을 반환
 * 
 * === 사용 예시 ===
 * POST /api/v1/chat/rooms
 * {
 *   "targetUserId": 5
 * }
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateChatRoomRequest {

    /**
     * 채팅 상대방 사용자 ID
     * 
     * === 검증 규칙 ===
     * - null이면 안됨
     * - 자기 자신의 ID이면 안됨 (서비스에서 검증)
     */
    @NotNull(message = "채팅 상대방 사용자 ID는 필수입니다.")
    private Long targetUserId;
}