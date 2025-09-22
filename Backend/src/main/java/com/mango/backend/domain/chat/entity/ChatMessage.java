package com.mango.backend.domain.chat.entity;

import com.mango.backend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 채팅 메시지 엔티티
 * 
 * === 채팅 메시지의 핵심 요소 ===
 * 1. 어떤 채팅방의 메시지인지 (chatRoomId)
 * 2. 누가 보냈는지 (senderId)  
 * 3. 어떤 타입의 메시지인지 (messageType - sub_code 참조)
 * 4. 메시지 내용 (content) 또는 파일 경로 (fileUrl)
 * 5. 메시지 순서 (sequenceNumber)
 * 6. 읽음 상태 (isRead)
 * 
 * === 테이블 설계 ===
 * CREATE TABLE chat_messages (
 *     id BIGINT AUTO_INCREMENT PRIMARY KEY,
 *     chat_room_id BIGINT NOT NULL,
 *     sender_id BIGINT NOT NULL,
 *     message_type VARCHAR(30) NOT NULL,     -- sub_code 참조 (예: "TEXT", "IMAGE")
 *     content TEXT,                          -- 텍스트 메시지 내용
 *     file_url VARCHAR(500),                 -- 이미지 파일 경로
 *     sequence_number BIGINT NOT NULL,       -- 메시지 순서 보장
 *     is_read BOOLEAN DEFAULT FALSE,         -- 읽음 상태
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *     
 *     FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id),
 *     INDEX idx_room_sequence (chat_room_id, sequence_number),  -- 채팅방별 메시지 순서 조회용
 *     INDEX idx_room_created (chat_room_id, created_at)         -- 채팅방별 시간순 조회용  
 * );
 *
 * === sequence_number를 사용하는 이유 ===
 * - 메시지 순서 보장: 네트워크 지연으로 인한 순서 뒤바뀜 방지
 * - 메시지 중복 방지: 동일한 sequence_number 방지
 */
@Entity
@Table(name = "chat_messages",
       indexes = {
           @Index(name = "idx_room_sequence", columnList = "chat_room_id, sequence_number"),
           @Index(name = "idx_room_created", columnList = "chat_room_id, created_at"),
           @Index(name = "idx_sender", columnList = "sender_id")
       })
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ChatMessage {

    /**
     * 메시지 고유 ID (Primary Key)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * 채팅방 ID (Foreign Key)
     * 
     * === 왜 ChatRoom 엔티티 참조 대신 Long을 사용하나요? ===
     * 1. 성능: 불필요한 JOIN 방지
     * 2. 단순성: 메시지 조회 시 채팅방 정보가 항상 필요하지 않음
     * 3. 확장성: 샤딩이나 분산DB 구조 적용 시 유리
     */
    @Column(name = "chat_room_id", nullable = false)
    private Long chatRoomId;

    /**
     * 메시지 발신자 ID
     */
    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    /**
     * 메시지 발신자 User 엔티티 연관관계
     *
     * === FetchType.LAZY 사용 이유 ===
     * 메시지 목록 조회 시 발신자 정보가 항상 필요한 것은 아니므로
     * 필요할 때만 로드하여 성능 최적화
     *
     * === insertable/updatable = false 설정 이유 ===
     * senderId 필드와 중복 매핑 방지
     * 실제 저장/수정은 senderId 필드로 처리
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", insertable = false, updatable = false)
    private User sender;

    /**
     * 메시지 타입
     * - "TEXT": 텍스트 메시지
     * - "IMAGE": 이미지 메시지
     * 
     * === 왜 SubCode 엔티티 참조 대신 String? ===
     * 1. 성능: 메시지 조회 시마다 sub_code JOIN 불필요
     * 2. 캐싱: 메시지 타입은 자주 변하지 않아 애플리케이션에서 캐싱 가능
     * 3. 단순성: 메시지 타입 확인이 빈번한데 문자열 비교가 더 직관적
     */
    @Column(name = "message_type", nullable = false, length = 30)
    private String messageType;

    /**
     * 텍스트 메시지 내용
     */
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    /**
     * 파일 URL (이미지, 파일 등)
     */
    @Column(name = "file_url", length = 500)
    private String fileUrl;

    /**
     * 메시지 순서 번호
     * 
     * === 순서 보장 로직 ===
     * 1. 채팅방의 마지막 sequence_number 조회
     * 2. +1 해서 새 메시지의 sequence_number 설정
     * 3. DB에 저장 (동시성 제어 필요)
     * 
     * === 동시성 문제 해결 ===
     * - 채팅방별로 락을 걸거나
     * - Redis 등으로 sequence_number 관리
     */
    @Column(name = "sequence_number", nullable = false)
    private Long sequenceNumber;

    /**
     * 읽음 상태
     * === 읽음 처리 시점 ===
     * - 상대방이 채팅방에 입장할 때
     * - 상대방이 해당 메시지가 화면에 표시될 때
     */
    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    /**
     * 메시지 생성 시간
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 엔티티 생성 시 자동으로 현재 시간 설정
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * 텍스트 메시지 생성을 위한 정적 팩토리 메서드
     * 
     * @param chatRoomId 채팅방 ID
     * @param senderId 발신자 ID
     * @param content 메시지 내용
     * @param sequenceNumber 메시지 순서 번호
     * @return 생성된 텍스트 메시지
     */
    public static ChatMessage createTextMessage(Long chatRoomId, Long senderId, 
                                               String content, Long sequenceNumber) {
        validateTextMessageParams(chatRoomId, senderId, content, sequenceNumber);
        
        return ChatMessage.builder()
                .chatRoomId(chatRoomId)
                .senderId(senderId)
                .messageType("TEXT")  // sub_code 값
                .content(content)
                .sequenceNumber(sequenceNumber)
                .build();
    }

    /**
     * 이미지 메시지 생성을 위한 정적 팩토리 메서드
     * 
     * @param chatRoomId 채팅방 ID
     * @param senderId 발신자 ID
     * @param fileUrl 이미지 파일 URL
     * @param sequenceNumber 메시지 순서 번호
     * @param description 이미지 설명 (선택사항)
     * @return 생성된 이미지 메시지
     */
    public static ChatMessage createImageMessage(Long chatRoomId, Long senderId, 
                                                String fileUrl, Long sequenceNumber, 
                                                String description) {
        validateImageMessageParams(chatRoomId, senderId, fileUrl, sequenceNumber);
        
        return ChatMessage.builder()
                .chatRoomId(chatRoomId)
                .senderId(senderId)
                .messageType("IMAGE")  // sub_code 값
                .fileUrl(fileUrl)
                .content(description)  // 이미지 설명 (선택사항)
                .sequenceNumber(sequenceNumber)
                .build();
    }

    /**
     * 텍스트 메시지 파라미터 검증
     */
    private static void validateTextMessageParams(Long chatRoomId, Long senderId, 
                                                 String content, Long sequenceNumber) {
        if (chatRoomId == null) {
            throw new IllegalArgumentException("채팅방 ID는 필수입니다.");
        }
        if (senderId == null) {
            throw new IllegalArgumentException("발신자 ID는 필수입니다.");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("메시지 내용은 필수입니다.");
        }
        if (sequenceNumber == null || sequenceNumber < 1) {
            throw new IllegalArgumentException("올바른 순서 번호가 필요합니다.");
        }
    }

    /**
     * 이미지 메시지 파라미터 검증
     */
    private static void validateImageMessageParams(Long chatRoomId, Long senderId, 
                                                  String fileUrl, Long sequenceNumber) {
        if (chatRoomId == null) {
            throw new IllegalArgumentException("채팅방 ID는 필수입니다.");
        }
        if (senderId == null) {
            throw new IllegalArgumentException("발신자 ID는 필수입니다.");
        }
        if (fileUrl == null || fileUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("파일 URL은 필수입니다.");
        }
        if (sequenceNumber == null || sequenceNumber < 1) {
            throw new IllegalArgumentException("올바른 순서 번호가 필요합니다.");
        }
    }

    /**
     * 메시지를 읽음 처리
     */
    public void markAsRead() {
        this.isRead = true;
    }

    /**
     * 텍스트 메시지인지 확인
     */
    public boolean isTextMessage() {
        return "TEXT".equals(this.messageType);
    }

    /**
     * 이미지 메시지인지 확인
     */
    public boolean isImageMessage() {
        return "IMAGE".equals(this.messageType);
    }

    /**
     * 파일을 포함하는 메시지인지 확인
     */
    public boolean hasFile() {
        return fileUrl != null && !fileUrl.trim().isEmpty();
    }
}