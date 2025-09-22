package com.mango.backend.domain.chat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 채팅방 목록 실시간 업데이트용 알림 DTO
 *
 * 채팅방 밖에서 새 메시지가 올 때 /topic/notification/{userId}로 전송됩니다.
 * 최소한의 정보만 포함하여 네트워크 부담을 줄입니다.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatNotificationDTO {

    /**
     * 채팅방 ID
     */
    private Long chatRoomId;

    /**
     * 마지막 메시지 내용 (미리보기용)
     */
    private String lastMessage;

    /**
     * 발신자 이름
     */
    private String senderName;

    /**
     * 발신자 ID
     */
    private Long senderId;

    /**
     * 메시지 전송 시간
     */
    private LocalDateTime timestamp;

    /**
     * 메시지 타입 (TEXT, IMAGE 등)
     */
    private String messageType;

    /**
     * 읽지 않은 메시지 수 (추후 구현)
     */
    private Integer unreadCount;

    /**
     * 알림 타입 (NEW_MESSAGE, READ_STATUS 등)
     */
    private String notificationType;

    /**
     * 정적 팩토리 메서드 - 새 메시지 알림 생성
     */
    public static ChatNotificationDTO newMessageNotification(
            Long chatRoomId,
            String content,
            String senderName,
            Long senderId,
            String messageType,
            LocalDateTime timestamp) {

        // 이미지 메시지인 경우 미리보기 텍스트 변경
        String preview = "IMAGE".equals(messageType) ? "사진을 보냈습니다" : content;

        return ChatNotificationDTO.builder()
                .chatRoomId(chatRoomId)
                .lastMessage(preview)
                .senderName(senderName)
                .senderId(senderId)
                .messageType(messageType)
                .timestamp(timestamp)
                .notificationType("NEW_MESSAGE")
                .unreadCount(1) // 임시로 1로 설정, 추후 실제 카운트 계산
                .build();
    }

    /**
     * 정적 팩토리 메서드 - 읽음 상태 알림 생성 (추후 구현용)
     */
    public static ChatNotificationDTO readStatusNotification(
            Long chatRoomId,
            Integer unreadCount) {

        return ChatNotificationDTO.builder()
                .chatRoomId(chatRoomId)
                .notificationType("READ_STATUS")
                .unreadCount(unreadCount)
                .timestamp(LocalDateTime.now())
                .build();
    }
}