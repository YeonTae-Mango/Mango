package com.mango.backend.domain.chat.service;

import com.mango.backend.domain.chat.entity.ChatMessage;
import com.mango.backend.domain.chat.entity.ChatRoom;
import com.mango.backend.domain.chat.repository.ChatMessageRepository;
import com.mango.backend.domain.chat.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 채팅 메시지 비즈니스 로직 서비스
 * 
 * === 주요 기능 ===
 * 1. 메시지 저장 (순서 보장)
 * 2. 채팅방 권한 검증
 * 3. 메시지 순서 번호 자동 생성
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;

    /**
     * 텍스트 메시지 저장
     * 
     * === 처리 과정 ===
     * 1. 채팅방 존재 확인
     * 2. 사용자 권한 검증 (채팅방 참가자인지)
     * 3. 메시지 순서 번호 생성
     * 4. 메시지 저장
     * 5. 채팅방 활동 시간 업데이트
     * 
     * @param chatRoomId 채팅방 ID
     * @param senderId 발신자 ID
     * @param content 메시지 내용
     * @return 저장된 메시지 엔티티
     * @throws IllegalArgumentException 채팅방이 없거나 권한이 없는 경우
     */
    @Transactional
    public ChatMessage saveTextMessage(Long chatRoomId, Long senderId, String content) {
        log.debug("텍스트 메시지 저장 시작 - 채팅방ID: {}, 발신자ID: {}", chatRoomId, senderId);
        
        // 1. 채팅방 존재 확인 및 권한 검증
        ChatRoom chatRoom = validateChatRoomAccess(chatRoomId, senderId);
        
        // 2. 메시지 순서 번호 생성
        Long sequenceNumber = generateNextSequenceNumber(chatRoomId);
        
        // 3. 메시지 엔티티 생성 및 저장
        ChatMessage message = ChatMessage.createTextMessage(
            chatRoomId, 
            senderId, 
            content, 
            sequenceNumber
        );
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        log.debug("텍스트 메시지 저장 완료 - 메시지ID: {}, 순서번호: {}",
                 savedMessage.getId(), savedMessage.getSequenceNumber());

        // 4. 채팅방 활동 시간 업데이트
        chatRoom.updateActivity();
        chatRoomRepository.save(chatRoom);

        // 5. User 정보 포함해서 조회 (브로드캐스트를 위해)
        return chatMessageRepository.findByIdWithSender(savedMessage.getId())
                .orElse(savedMessage); // 조회 실패 시 기본 메시지 반환
    }

    /**
     * 이미지 메시지 저장
     * 
     * @param chatRoomId 채팅방 ID
     * @param senderId 발신자 ID
     * @param fileUrl 이미지 파일 URL
     * @param description 이미지 설명 (선택사항)
     * @return 저장된 메시지 엔티티
     */
    @Transactional
    public ChatMessage saveImageMessage(Long chatRoomId, Long senderId, String fileUrl, String description) {
        log.debug("이미지 메시지 저장 시작 - 채팅방ID: {}, 발신자ID: {}, 파일URL: {}", 
                 chatRoomId, senderId, fileUrl);
        
        // 1. 채팅방 존재 확인 및 권한 검증
        ChatRoom chatRoom = validateChatRoomAccess(chatRoomId, senderId);
        
        // 2. 메시지 순서 번호 생성
        Long sequenceNumber = generateNextSequenceNumber(chatRoomId);
        
        // 3. 메시지 엔티티 생성 및 저장
        ChatMessage message = ChatMessage.createImageMessage(
            chatRoomId, 
            senderId, 
            fileUrl, 
            sequenceNumber, 
            description
        );
        
        ChatMessage savedMessage = chatMessageRepository.save(message);
        log.debug("이미지 메시지 저장 완료 - 메시지ID: {}, 순서번호: {}", 
                 savedMessage.getId(), savedMessage.getSequenceNumber());
        
        // 4. 채팅방 활동 시간 업데이트
        chatRoom.updateActivity();
        chatRoomRepository.save(chatRoom);
        
        return savedMessage;
    }

    /**
     * 채팅방 접근 권한 검증
     * 
     * @param chatRoomId 채팅방 ID
     * @param userId 사용자 ID
     * @return 검증된 채팅방 엔티티
     * @throws IllegalArgumentException 채팅방이 없거나 접근 권한이 없는 경우
     */
    private ChatRoom validateChatRoomAccess(Long chatRoomId, Long userId) {
        // 채팅방 존재 확인
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다. ID: " + chatRoomId));
        
        // 채팅방 참가자 권한 확인
        if (!chatRoom.isParticipant(userId)) {
            throw new IllegalArgumentException("채팅방에 접근할 권한이 없습니다. 사용자ID: " + userId + ", 채팅방ID: " + chatRoomId);
        }
        
        return chatRoom;
    }

    /**
     * 다음 메시지 순서 번호 생성
     * 
     * === 동시성 처리 ===
     * 여러 메시지가 동시에 전송될 때 순서가 뒤바뀌지 않도록 보장
     * 현재는 간단한 방식이지만, 트래픽이 많아지면 Redis 등으로 개선 가능
     * 
     * @param chatRoomId 채팅방 ID
     * @return 다음 순서 번호
     */
    private Long generateNextSequenceNumber(Long chatRoomId) {
        Long lastSequence = chatMessageRepository.findMaxSequenceNumberByChatRoomId(chatRoomId)
                .orElse(0L);
        
        Long nextSequence = lastSequence + 1;
        log.debug("메시지 순서 번호 생성 - 채팅방ID: {}, 마지막순서: {}, 다음순서: {}", 
                 chatRoomId, lastSequence, nextSequence);
        
        return nextSequence;
    }

    /**
     * 채팅방의 읽지 않은 메시지를 모두 읽음 처리 (채팅방 들어갈때)
     * 
     * === 처리 과정 ===
     * 1. 채팅방 접근 권한 검증
     * 2. 내가 보낸 메시지가 아닌 안 읽은 메시지들을 찾아서 읽음 처리
     * 3. 읽음 처리된 메시지 개수 반환
     * 
     * @param chatRoomId 채팅방 ID
     * @param userId 읽은 사용자 ID
     * @return 읽음 처리된 메시지 개수
     * @throws IllegalArgumentException 채팅방이 없거나 권한이 없는 경우
     */
    @Transactional
    public int markMessagesAsRead(Long chatRoomId, Long userId) {
        log.debug("메시지 읽음 처리 시작 - 채팅방ID: {}, 사용자ID: {}", chatRoomId, userId);
        
        // 1. 채팅방 존재 확인 및 권한 검증
        validateChatRoomAccess(chatRoomId, userId);
        
        // 2. 읽지 않은 메시지들을 일괄 읽음 처리
        int readCount = chatMessageRepository.markMessagesAsReadByChatRoomIdAndUserId(chatRoomId, userId);
        
        log.debug("메시지 읽음 처리 완료 - 채팅방ID: {}, 사용자ID: {}, 읽음처리개수: {}", 
                 chatRoomId, userId, readCount);
        
        return readCount;
    }
}