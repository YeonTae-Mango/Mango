package com.mango.backend.domain.chat.repository;

import com.mango.backend.domain.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 채팅방 데이터 접근을 위한 Repository 인터페이스
 * 
 * === JpaRepository 상속의 이점 ===
 * 1. 기본 CRUD 자동 제공: save(), findById(), deleteById() 등
 * 2. 메서드 이름으로 쿼리 자동 생성: findByUser1IdAndUser2Id() 등
 * 3. 페이징과 정렬 지원: Pageable, Sort 사용 가능
 * 4. 트랜잭션 관리 자동화
 * 
 * === 채팅방 조회의 핵심 패턴 ===
 * 1. 두 사용자 간 채팅방 찾기 (user1_id < user2_id 규칙 적용)
 * 2. 특정 사용자가 참여한 모든 채팅방 조회
 * 3. 최근 활동 순으로 채팅방 목록 조회
 */
@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    /**
     * 두 사용자 간의 채팅방을 찾습니다
     * 
     * === 중요한 가정 ===
     * 매개변수로 전달되는 user1Id와 user2Id는 이미 정렬된 상태여야 합니다.
     * 즉, user1Id < user2Id 이어야 합니다.
     * 
     * === 사용 예시 ===
     * Long userId1 = 5L, userId2 = 3L;
     * Long smallerId = Math.min(userId1, userId2);  // 3
     * Long largerId = Math.max(userId1, userId2);   // 5
     * Optional<ChatRoom> room = chatRoomRepository.findByUser1IdAndUser2Id(smallerId, largerId);
     * 
     * @param user1Id 더 작은 사용자 ID
     * @param user2Id 더 큰 사용자 ID  
     * @return 채팅방이 존재하면 Optional로 감싸서 반환, 없으면 Optional.empty()
     */
    Optional<ChatRoom> findByUser1IdAndUser2Id(Long user1Id, Long user2Id);

    /**
     * 특정 사용자가 참여한 모든 채팅방을 최근 활동 순으로 조회
     * 
     * === 쿼리 설명 ===
     * - user1_id = :userId OR user2_id = :userId: 해당 사용자가 참여한 채팅방
     * - ORDER BY updated_at DESC: 최근 활동이 있었던 채팅방부터 정렬
     * 
     * === 언제 사용하나요? ===
     * - 사용자의 채팅방 목록 화면
     * - 새 메시지가 있는 채팅방 우선 표시
     * 
     * @param userId 사용자 ID
     * @return 해당 사용자가 참여한 채팅방 목록 (최신 활동 순)
     */
    @Query("SELECT cr FROM ChatRoom cr " +
           "WHERE cr.user1Id = :userId OR cr.user2Id = :userId " +
           "ORDER BY cr.updatedAt DESC")
    List<ChatRoom> findByUserIdOrderByUpdatedAtDesc(@Param("userId") Long userId);

    /**
     * 특정 사용자가 참여한 채팅방 개수 조회
     * 
     * === 언제 사용하나요? ===
     * - 사용자 프로필에서 "진행 중인 채팅 N개" 표시
     * - 채팅방 개수 제한 검사 (필요시)
     * - 통계 데이터 수집
     * 
     * @param userId 사용자 ID
     * @return 참여 중인 채팅방 개수
     */
    @Query("SELECT COUNT(cr) FROM ChatRoom cr " +
           "WHERE cr.user1Id = :userId OR cr.user2Id = :userId")
    long countByUserId(@Param("userId") Long userId);

    /**
     * 특정 사용자가 참여한 채팅방 중에서 ID로 조회
     * 
     * === 보안상 중요한 메서드 ===
     * 단순히 findById()만 사용하면 다른 사용자의 채팅방도 조회할 수 있습니다.
     * 이 메서드는 해당 사용자가 실제로 참여한 채팅방인지 검증합니다.
     * 
     * === 사용 예시 ===
     * // 사용자가 채팅방 10번에 접근하려고 할 때
     * Optional<ChatRoom> room = chatRoomRepository.findByIdAndUserId(10L, currentUserId);
     * if (room.isPresent()) {
     *     // 접근 권한 있음
     * } else {
     *     // 접근 권한 없음 - 404 또는 403 에러
     * }
     * 
     * @param chatRoomId 채팅방 ID
     * @param userId 사용자 ID
     * @return 해당 사용자가 참여한 채팅방이면 반환, 아니면 empty
     */
    @Query("SELECT cr FROM ChatRoom cr " +
           "WHERE cr.id = :chatRoomId AND (cr.user1Id = :userId OR cr.user2Id = :userId)")
    Optional<ChatRoom> findByIdAndUserId(@Param("chatRoomId") Long chatRoomId, 
                                        @Param("userId") Long userId);

    /**
     * 두 사용자 간에 채팅방이 존재하는지 확인
     * 
     * === exists 메서드의 장점 ===
     * - 엔티티를 로드하지 않고 존재 여부만 확인
     * - 메모리 효율적
     * - COUNT 쿼리보다 성능상 유리 (존재하면 즉시 반환)
     * 
     * === 사용 예시 ===
     * Long smallerId = Math.min(userId1, userId2);
     * Long largerId = Math.max(userId1, userId2);
     * if (chatRoomRepository.existsByUser1IdAndUser2Id(smallerId, largerId)) {
     *     // 이미 채팅방 존재
     * } else {
     *     // 새 채팅방 생성 필요
     * }
     * 
     * @param user1Id 더 작은 사용자 ID
     * @param user2Id 더 큰 사용자 ID
     * @return 채팅방이 존재하면 true, 없으면 false
     */
    boolean existsByUser1IdAndUser2Id(Long user1Id, Long user2Id);
}