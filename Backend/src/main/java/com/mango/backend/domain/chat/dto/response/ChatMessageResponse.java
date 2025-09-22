package com.mango.backend.domain.chat.dto.response;

import com.mango.backend.domain.chat.entity.ChatMessage;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 채팅 메시지 응답 DTO
 * 
 * === 서버에서 클라이언트로 메시지 전송 시 사용 ===
 * WebSocket을 통해 /topic/chat/{roomId}로 브로드캐스트되는 데이터
 * 
 * === 사용 예시 ===
 * {
 *   "id": 123,
 *   "chatRoomId": 1,
 *   "senderId": 5,
 *   "senderNickname": "홍길동",
 *   "messageType": "TEXT",
 *   "content": "안녕하세요!",
 *   "fileUrl": null,
 *   "sequenceNumber": 15,
 *   "isRead": false,
 *   "createdAt": "2024-03-15T14:30:00"
 * }
 */
@Getter
@Builder
public class ChatMessageResponse {

    /**
     * 메시지 고유 ID
     */
    private Long id;

    /**
     * 채팅방 ID
     */
    private Long chatRoomId;

    /**
     * 발신자 ID
     */
    private Long senderId;

    /**
     * 발신자 닉네임 (사용자 정보에서 조회)
     */
    private String senderNickname;

    /**
     * 메시지 타입
     */
    private String messageType;

    /**
     * 텍스트 메시지 내용
     */
    private String content;

    /**
     * 파일 URL (이미지 등)
     */
    private String fileUrl;

    /**
     * 메시지 순서 번호
     */
    private Long sequenceNumber;

    /**
     * 읽음 상태
     */
    private Boolean isRead;

    /**
     * 생성 시간
     */
    private LocalDateTime createdAt;

    /**
     * ChatMessage 엔티티를 ChatMessageResponse로 변환
     * 
     * @param chatMessage 변환할 채팅 메시지 엔티티
     * @param senderNickname 발신자 닉네임 (User 서비스에서 조회)
     * @return 변환된 응답 DTO
     */
    public static ChatMessageResponse from(ChatMessage chatMessage, String senderNickname) {
        return ChatMessageResponse.builder()
                .id(chatMessage.getId())
                .chatRoomId(chatMessage.getChatRoomId())
                .senderId(chatMessage.getSenderId())
                .senderNickname(senderNickname)
                .messageType(chatMessage.getMessageType())
                .content(chatMessage.getContent())
                .fileUrl(chatMessage.getFileUrl())
                .sequenceNumber(chatMessage.getSequenceNumber())
                .isRead(chatMessage.getIsRead())
                .createdAt(chatMessage.getCreatedAt())
                .build();
    }

    /**
     * User 엔티티 연관관계를 사용해서 ChatMessage를 Response로 변환
     *
     * @param chatMessage 변환할 채팅 메시지 엔티티 (sender 연관관계 로드 필요)
     * @return 변환된 응답 DTO
     */
    public static ChatMessageResponse fromEntity(ChatMessage chatMessage) {
        String senderNickname = "Unknown User";

        // sender 연관관계를 통해 실제 사용자 닉네임 조회
        if (chatMessage.getSender() != null) {
            senderNickname = chatMessage.getSender().getNickname();
        } else {
            // 연관관계가 로드되지 않은 경우 임시 방식 사용
            senderNickname = "User" + chatMessage.getSenderId();
        }

        return ChatMessageResponse.builder()
                .id(chatMessage.getId())
                .chatRoomId(chatMessage.getChatRoomId())
                .senderId(chatMessage.getSenderId())
                .senderNickname(senderNickname)
                .messageType(chatMessage.getMessageType())
                .content(chatMessage.getContent())
                .fileUrl(chatMessage.getFileUrl())
                .sequenceNumber(chatMessage.getSequenceNumber())
                .isRead(chatMessage.getIsRead())
                .createdAt(chatMessage.getCreatedAt())
                .build();
    }

    /**
     * 닉네임 없이 ChatMessage 엔티티를 ChatMessageResponse로 변환
     * 닉네임은 "Unknown User"로 설정됨
     *
     * @param chatMessage 변환할 채팅 메시지 엔티티
     * @return 변환된 응답 DTO
     */
    public static ChatMessageResponse from(ChatMessage chatMessage) {
        return from(chatMessage, "Unknown User");
    }
}