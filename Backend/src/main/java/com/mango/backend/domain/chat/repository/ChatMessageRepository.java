package com.mango.backend.domain.chat.repository;

import com.mango.backend.domain.chat.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 채팅 메시지 데이터 접근을 위한 Repository 인터페이스
 * 
 * === 채팅 메시지 조회의 핵심 패턴 ===
 * 1. 채팅방별 메시지 목록 조회 (페이징 지원)
 * 2. 메시지 순서 보장을 위한 sequence_number 활용
 * 3. 읽음 상태 관리
 * 4. 최신 메시지 조회 (채팅방 목록에서 미리보기용)
 * 
 * === 성능 최적화 고려사항 ===
 * 1. 인덱스 활용: (chat_room_id, sequence_number), (chat_room_id, created_at)
 * 2. 페이징으로 대량 메시지 처리
 * 3. 읽음 상태 일괄 업데이트
 */
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /**
     * 채팅방의 메시지를 순서대로 페이징 조회
     * 
     * === 순서 보장 ===
     * sequence_number 기준으로 정렬하여 메시지 순서를 보장합니다.
     * created_at 보다 sequence_number가 더 정확한 순서를 제공합니다.
     * 
     * === 페이징 사용법 ===
     * Pageable pageable = PageRequest.of(0, 20, Sort.by("sequenceNumber").ascending());
     * Page<ChatMessage> messages = repository.findByChatRoomIdOrderBySequenceNumberAsc(roomId, pageable);
     * 
     * === 왜 Page 반환? ===
     * - 전체 메시지 개수 제공 (totalElements)
     * - 페이지 정보 제공 (totalPages, hasNext, hasPrevious)
     * - 클라이언트에서 무한 스크롤 구현 시 유용
     * 
     * @param chatRoomId 채팅방 ID
     * @param pageable 페이징 정보 (페이지 번호, 크기, 정렬)
     * @return 페이징된 메시지 목록
     */
    Page<ChatMessage> findByChatRoomIdOrderBySequenceNumberAsc(Long chatRoomId, Pageable pageable);


    /**
     * 채팅방의 최신 메시지 조회
     * 
     * === 언제 사용하나요? ===
     * - 채팅방 목록에서 마지막 메시지 미리보기
     * - 새 메시지 알림 표시
     * - 채팅방 정렬 기준 (최신 메시지 시간)
     * 
     * === LIMIT 1 최적화 ===
     * - TOP 1로 최신 메시지만 조회하여 성능 최적화
     * - 인덱스 (chat_room_id, sequence_number DESC) 활용
     * 
     * @param chatRoomId 채팅방 ID
     * @return 최신 메시지 (없으면 empty)
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoomId = :chatRoomId " +
           "ORDER BY cm.sequenceNumber DESC " +
           "LIMIT 1")
    Optional<ChatMessage> findLatestMessageByChatRoomId(@Param("chatRoomId") Long chatRoomId);

    /**
     * 채팅방의 마지막 sequence_number 조회
     * 
     * === 새 메시지 순서 번호 생성용 ===
     * 새 메시지를 저장할 때 사용할 다음 sequence_number를 결정하기 위해 사용
     * 
     * === 사용 예시 ===
     * Long lastSequence = repository.findMaxSequenceNumberByChatRoomId(roomId).orElse(0L);
     * Long nextSequence = lastSequence + 1;
     * ChatMessage newMessage = ChatMessage.createTextMessage(..., nextSequence);
     * 
     * === 동시성 주의사항 ===
     * 여러 사용자가 동시에 메시지를 보낼 때 sequence_number 중복 가능
     * 실제 운영에서는 동시성 제어가 필요 (락 또는 atomic 연산)
     * 
     * @param chatRoomId 채팅방 ID
     * @return 마지막 sequence_number (메시지가 없으면 empty)
     */
    @Query("SELECT MAX(cm.sequenceNumber) FROM ChatMessage cm WHERE cm.chatRoomId = :chatRoomId")
    Optional<Long> findMaxSequenceNumberByChatRoomId(@Param("chatRoomId") Long chatRoomId);

    /**
     * 채팅방의 읽지 않은 메시지 개수 조회
     * 
     * === 읽지 않은 메시지 = 내가 보낸 게 아니면서 읽지 않은 메시지 ===
     * - senderId != :userId: 상대방이 보낸 메시지
     * - isRead = false: 아직 읽지 않은 메시지
     * 
     * === 언제 사용하나요? ===
     * - 채팅방 목록에서 안 읽은 메시지 개수 뱃지 표시
     * - 푸시 알림 발송 여부 결정
     * - 사용자 UI에서 읽지 않은 메시지 강조
     * 
     * @param chatRoomId 채팅방 ID
     * @param userId 현재 사용자 ID (자신이 보낸 메시지는 제외)
     * @return 읽지 않은 메시지 개수
     */
    @Query("SELECT COUNT(cm) FROM ChatMessage cm " +
           "WHERE cm.chatRoomId = :chatRoomId AND cm.senderId != :userId AND cm.isRead = false")
    long countUnreadMessagesByChatRoomIdAndUserId(@Param("chatRoomId") Long chatRoomId, 
                                                 @Param("userId") Long userId);

    /**
     * 채팅방의 모든 읽지 않은 메시지를 읽음 처리
     * 
     * === 일괄 업데이트의 이점 ===
     * - 여러 메시지를 한 번의 쿼리로 처리 → 성능 향상
     * - 트랜잭션 내에서 원자적 처리
     * - 네트워크 통신 횟수 감소
     * 
     * === 언제 호출하나요? ===
     * - 사용자가 채팅방에 입장할 때
     * - 사용자가 메시지를 읽었다는 신호를 보낼 때
     * - 앱이 포그라운드로 올라올 때
     * 
     * === @Modifying 주의사항 ===
     * - @Modifying: UPDATE/DELETE 쿼리임을 명시
     * - 반환값은 영향받은 행 수
     * - 영속성 컨텍스트와 DB 동기화 필요시 clearAutomatically = true 설정
     * 
     * @param chatRoomId 채팅방 ID
     * @param userId 현재 사용자 ID (자신이 보낸 메시지는 제외)
     * @return 읽음 처리된 메시지 개수
     */
    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.isRead = true " +
           "WHERE cm.chatRoomId = :chatRoomId AND cm.senderId != :userId AND cm.isRead = false")
    int markMessagesAsReadByChatRoomIdAndUserId(@Param("chatRoomId") Long chatRoomId, 
                                               @Param("userId") Long userId);

    /**
     * 특정 메시지 이후의 읽지 않은 메시지들을 조회
     * 
     * === 실시간 알림용 ===
     * - 사용자가 마지막으로 읽은 메시지 이후 새로 온 메시지들
     * - 푸시 알림이나 실시간 업데이트에 활용
     * 
     * === 사용 예시 ===
     * // 사용자가 마지막으로 읽은 메시지 sequence가 100일 때
     * List<ChatMessage> newMessages = repository.findUnreadMessagesAfterSequence(roomId, userId, 100L);
     * // sequence 101 이상의 읽지 않은 메시지들을 조회
     * 
     * @param chatRoomId 채팅방 ID
     * @param userId 현재 사용자 ID (자신이 보낸 메시지는 제외)  
     * @param lastReadSequence 마지막으로 읽은 메시지의 sequence_number
     * @return 읽지 않은 새 메시지 목록
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoomId = :chatRoomId " +
           "AND cm.senderId != :userId " +
           "AND cm.sequenceNumber > :lastReadSequence " +
           "AND cm.isRead = false " +
           "ORDER BY cm.sequenceNumber ASC")
    List<ChatMessage> findUnreadMessagesAfterSequence(@Param("chatRoomId") Long chatRoomId,
                                                      @Param("userId") Long userId,
                                                      @Param("lastReadSequence") Long lastReadSequence);

    /**
     * 채팅방별 메시지 개수 조회
     * 
     * === 통계 및 제한 확인용 ===
     * - 채팅방당 메시지 개수 통계
     * - 메시지 개수 제한 체크 (필요시)
     * - 데이터 정리 작업 시 참고
     * 
     * @param chatRoomId 채팅방 ID
     * @return 해당 채팅방의 총 메시지 개수
     */
    long countByChatRoomId(Long chatRoomId);

    /**
     * 특정 사용자가 보낸 메시지들 조회 (특정 채팅방)
     *
     * === 언제 사용하나요? ===
     * - 사용자별 메시지 히스토리 분석
     * - 스팸 메시지 탐지
     * - 사용자 활동 통계
     *
     * @param chatRoomId 채팅방 ID
     * @param senderId 발신자 ID
     * @param pageable 페이징 정보
     * @return 해당 사용자가 보낸 메시지 목록
     */
    Page<ChatMessage> findByChatRoomIdAndSenderIdOrderBySequenceNumberAsc(Long chatRoomId,
                                                                          Long senderId,
                                                                          Pageable pageable);

    /**
     * 메시지를 ID로 조회하면서 발신자 정보도 함께 가져오기
     *
     * === JOIN FETCH 사용 이유 ===
     * - 메시지 응답 DTO 생성 시 발신자 닉네임이 필요
     * - N+1 문제 방지: 메시지마다 개별 User 쿼리 실행 방지
     * - 성능 최적화: 한 번의 쿼리로 메시지+발신자 정보 모두 로드
     *
     * @param messageId 조회할 메시지 ID
     * @return 발신자 정보가 포함된 메시지 (Optional)
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "JOIN FETCH cm.sender " +
           "WHERE cm.id = :messageId")
    Optional<ChatMessage> findByIdWithSender(@Param("messageId") Long messageId);

    /**
     * 채팅방의 메시지들을 발신자 정보와 함께 조회
     *
     * === 언제 사용하나요? ===
     * - 채팅 메시지 히스토리 화면에서 발신자 닉네임 표시
     * - 메시지 목록을 한 번에 조회하면서 N+1 문제 방지
     *
     * @param chatRoomId 채팅방 ID
     * @param pageable 페이징 정보
     * @return 발신자 정보가 포함된 메시지 목록
     */
    @Query("SELECT cm FROM ChatMessage cm " +
           "JOIN FETCH cm.sender " +
           "WHERE cm.chatRoomId = :chatRoomId " +
           "ORDER BY cm.sequenceNumber ASC")
    Page<ChatMessage> findByChatRoomIdWithSender(@Param("chatRoomId") Long chatRoomId, Pageable pageable);
}