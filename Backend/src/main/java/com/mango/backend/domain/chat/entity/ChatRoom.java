package com.mango.backend.domain.chat.entity;

import com.mango.backend.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 채팅방 엔티티
 * 
 * === 소개팅 앱에서의 채팅방 특징 ===
 * - 1:1 채팅만 존재 (그룹 채팅 없음)
 * - 두 사용자가 매칭되면 자동으로 채팅방이 생성됨
 * - 중복 채팅방 방지를 위해 user1_id < user2_id 규칙 적용
 * 
 * === 테이블 설계 핵심 아이디어 ===
 * CREATE TABLE chat_rooms (
 *     id BIGINT AUTO_INCREMENT PRIMARY KEY,
 *     user1_id BIGINT NOT NULL,           -- 더 작은 ID (항상 user1_id < user2_id)
 *     user2_id BIGINT NOT NULL,           -- 더 큰 ID
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *     UNIQUE KEY unique_users (user1_id, user2_id),  -- 중복 채팅방 방지
 *     INDEX idx_user1 (user1_id),
 *     INDEX idx_user2 (user2_id)
 * );
 * 
 * === user1_id < user2_id 규칙을 사용하는 이유 ===
 * 1. 중복 방지: A-B 채팅방과 B-A 채팅방이 따로 생성되는 것을 방지
 * 2. 쉬운 조회: 항상 동일한 방법으로 채팅방을 찾을 수 있음
 * 3. 성능 향상: UNIQUE 제약조건으로 빠른 중복 검사
 * 
 * === 사용 예시 ===
 * // 사용자 ID 5번과 3번이 매칭될 때
 * ChatRoom chatRoom = ChatRoom.createChatRoom(5L, 3L);
 * // 결과: user1_id=3, user2_id=5 (작은 ID가 먼저)
 */
@Entity
@Table(name = "chat_rooms",
       uniqueConstraints = @UniqueConstraint(
           name = "unique_users", 
           columnNames = {"user1_id", "user2_id"}
       ),
       indexes = {
           @Index(name = "idx_user1", columnList = "user1_id"),
           @Index(name = "idx_user2", columnList = "user2_id")
       })
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)  // JPA 용도로만 사용, 외부에서 생성자 호출 불가
@AllArgsConstructor(access = AccessLevel.PRIVATE)   // Builder 패턴에서만 사용
public class ChatRoom {

    /**
     * 채팅방 고유 ID (Primary Key)
     * 
     * === GenerationType.IDENTITY 사용 이유 ===
     * - MySQL의 AUTO_INCREMENT 기능 사용
     * - 데이터베이스가 ID 값을 자동으로 생성
     * - 여러 서버에서 동시 접근해도 중복 없음
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * 첫 번째 사용자 ID (항상 더 작은 ID)
     */
    @Column(name = "user1_id", nullable = false)
    private Long user1Id;

    /**
     * 두 번째 사용자 ID (항상 더 큰 ID)
     */
    @Column(name = "user2_id", nullable = false)
    private Long user2Id;

    /**
     * 첫 번째 사용자 엔티티 연관관계
     *
     * === JoinColumn 설정 ===
     * - name: 외래키 컬럼명 (user1_id)
     * - insertable/updatable = false: user1Id 필드와 중복 매핑 방지
     * - fetch = LAZY: 필요할 때만 사용자 정보 로드 (성능 최적화)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", insertable = false, updatable = false)
    private User user1;

    /**
     * 두 번째 사용자 엔티티 연관관계
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", insertable = false, updatable = false)
    private User user2;
    /**
     * 채팅방 생성 시간
     * 
     * === LocalDateTime vs Timestamp ===
     * - LocalDateTime: Java 8+ 권장, 타임존 문제 없음
     * - @CreationTimestamp: Hibernate가 자동으로 현재시간 설정
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * 채팅방 정보 마지막 수정 시간
     * 
     * === 언제 업데이트되나요? ===
     * - 새로운 메시지가 오면 자동 업데이트
     * - 최근 활동이 있는 채팅방 순서로 정렬할 때 사용
     */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * JPA Callback 메서드들
     * 엔티티 생명주기에 따라 자동 실행되는 메서드들
     */
    
    /**
     * 엔티티가 처음 저장되기 전에 실행
     * 생성 시간과 수정 시간을 현재 시간으로 설정
     */
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    /**
     * 엔티티가 업데이트되기 전에 실행  
     * 수정 시간을 현재 시간으로 업데이트
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 채팅방을 생성하는 정적 팩토리 메서드
     * 
     * === 팩토리 메서드 패턴 사용 이유 ===
     * 1. 생성 로직이 복잡할 때 캡슐화
     * 2. 매개변수 검증을 한 곳에서 처리
     * 3. user1_id < user2_id 규칙을 자동 적용
     * 
     * @param userId1 첫 번째 사용자 ID
     * @param userId2 두 번째 사용자 ID  
     * @return 생성된 채팅방 엔티티
     * @throws IllegalArgumentException 같은 사용자끼리 채팅방 생성 시도 시
     */
    public static ChatRoom createChatRoom(Long userId1, Long userId2) {
        /*
         * === 입력값 검증 ===
         * 1. null 체크: NPE 방지
         * 2. 동일 사용자 체크: 자기 자신과는 채팅 불가
         */
        if (userId1 == null || userId2 == null) {
            throw new IllegalArgumentException("사용자 ID는 null일 수 없습니다.");
        }
        
        if (userId1.equals(userId2)) {
            throw new IllegalArgumentException("자기 자신과는 채팅방을 만들 수 없습니다.");
        }

        /*
         * === ID 정렬 로직 ===
         * Math.min/max를 사용해서 항상 작은 ID가 user1이 되도록 보장
         * 예: userId1=10, userId2=5 → user1Id=5, user2Id=10
         */
        Long smallerId = Math.min(userId1, userId2);
        Long largerId = Math.max(userId1, userId2);

        return ChatRoom.builder()
                .user1Id(smallerId)  // 작은 ID
                .user2Id(largerId)   // 큰 ID
                .build();
    }

    /**
     * 특정 사용자가 이 채팅방의 참가자인지 확인
     * 
     * === 언제 사용하나요? ===
     * - 사용자가 채팅방에 접근할 권한이 있는지 검증
     * - 메시지를 보낼 수 있는지 확인
     * - 채팅방 목록 조회 시 필터링
     * 
     * @param userId 확인할 사용자 ID
     * @return 참가자이면 true, 아니면 false
     */
    public boolean isParticipant(Long userId) {
        return userId != null && (userId.equals(user1Id) || userId.equals(user2Id));
    }

    /**
     * 채팅 상대방의 ID를 반환
     * 
     * === 사용 예시 ===
     * 내가 user1이면 user2의 ID를, 내가 user2면 user1의 ID를 반환
     * 
     * @param myUserId 내 사용자 ID
     * @return 상대방 사용자 ID
     * @throws IllegalArgumentException 채팅방 참가자가 아닐 때
     */
    public Long getOtherUserId(Long myUserId) {
        if (!isParticipant(myUserId)) {
            throw new IllegalArgumentException("채팅방 참가자가 아닙니다.");
        }
        
        return myUserId.equals(user1Id) ? user2Id : user1Id;
    }

    /**
     * 채팅방 활동 시간 업데이트
     * 
     * === 언제 호출하나요? ===
     * - 새로운 메시지가 전송될 때
     * - 메시지를 읽음 처리할 때
     * - 기타 채팅방 관련 활동이 있을 때
     */
    public void updateActivity() {
        this.updatedAt = LocalDateTime.now();
    }
}