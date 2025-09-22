package com.mango.backend.domain.chat.dto.response;

import com.mango.backend.domain.chat.entity.ChatRoom;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 채팅방 정보 응답 DTO
 * 
 * === 언제 사용하나요? ===
 * - 내 채팅방 목록 조회 시
 * - 채팅방 생성/조회 시  
 * - 채팅방 상세 정보 표시 시
 * 
 * === 응답 예시 ===
 * {
 *   "id": 1,
 *   "otherUserId": 5,
 *   "otherUserNickname": "김철수",
 *   "otherUserProfileImage": "/uploads/profiles/kim.jpg",
 *   "lastMessage": "안녕하세요!",
 *   "lastMessageTime": "2024-03-15T14:30:00",
 *   "unreadCount": 3,
 *   "createdAt": "2024-03-10T10:00:00",
 *   "updatedAt": "2024-03-15T14:30:00"
 * }
 */
@Getter
@Builder
public class ChatRoomResponse {

    /**
     * 채팅방 고유 ID
     */
    private Long id;

    /**
     * 채팅 상대방 사용자 ID
     */
    private Long otherUserId;

    /**
     * 채팅 상대방 닉네임
     * User 서비스에서 조회해서 설정
     */
    private String otherUserNickname;

    /**
     * 채팅 상대방 프로필 이미지 URL
     * User 서비스에서 조회해서 설정
     */
    private String otherUserProfileImage;

    /**
     * 마지막 메시지 내용
     * 텍스트면 내용, 이미지면 "[이미지]" 형태로 표시
     */
    private String lastMessage;

    /**
     * 마지막 메시지 시간
     */
    private LocalDateTime lastMessageTime;

    /**
     * 읽지 않은 메시지 개수
     */
    private Long unreadCount;

    /**
     * 채팅방 생성 시간
     */
    private LocalDateTime createdAt;

    /**
     * 채팅방 마지막 활동 시간
     */
    private LocalDateTime updatedAt;

    /**
     * ChatRoom 엔티티를 ChatRoomResponse로 변환
     * 
     * === 주의사항 ===
     * - otherUser 정보는 별도로 설정해야 함 (User 서비스 연동)
     * - lastMessage 정보는 별도로 설정해야 함 (ChatMessage 조회)
     * 
     * @param chatRoom 채팅방 엔티티
     * @param currentUserId 현재 사용자 ID (상대방 ID 계산용)
     * @return 기본 정보가 설정된 응답 DTO
     */
    public static ChatRoomResponse from(ChatRoom chatRoom, Long currentUserId) {
        return ChatRoomResponse.builder()
                .id(chatRoom.getId())
                .otherUserId(chatRoom.getOtherUserId(currentUserId))
                .createdAt(chatRoom.getCreatedAt())
                .updatedAt(chatRoom.getUpdatedAt())
                // 나머지 필드들은 별도 메서드로 설정
                .build();
    }

    /**
     * 상대방 사용자 정보 설정
     * 
     * @param nickname 상대방 닉네임
     * @param profileImage 상대방 프로필 이미지
     * @return 사용자 정보가 설정된 응답 DTO
     */
    public ChatRoomResponse withOtherUserInfo(String nickname, String profileImage) {
        return ChatRoomResponse.builder()
                .id(this.id)
                .otherUserId(this.otherUserId)
                .otherUserNickname(nickname)
                .otherUserProfileImage(profileImage)
                .lastMessage(this.lastMessage)
                .lastMessageTime(this.lastMessageTime)
                .unreadCount(this.unreadCount)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .build();
    }

    /**
     * 마지막 메시지 정보 설정
     * 
     * @param lastMessage 마지막 메시지 내용
     * @param lastMessageTime 마지막 메시지 시간
     * @param unreadCount 읽지 않은 메시지 개수
     * @return 메시지 정보가 설정된 응답 DTO
     */
    public ChatRoomResponse withLastMessageInfo(String lastMessage, LocalDateTime lastMessageTime, Long unreadCount) {
        return ChatRoomResponse.builder()
                .id(this.id)
                .otherUserId(this.otherUserId)
                .otherUserNickname(this.otherUserNickname)
                .otherUserProfileImage(this.otherUserProfileImage)
                .lastMessage(lastMessage)
                .lastMessageTime(lastMessageTime)
                .unreadCount(unreadCount)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .build();
    }
}