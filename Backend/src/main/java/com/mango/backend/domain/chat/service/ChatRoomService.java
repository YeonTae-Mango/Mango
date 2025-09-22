package com.mango.backend.domain.chat.service;

import com.mango.backend.domain.chat.dto.response.ChatRoomResponse;
import com.mango.backend.domain.chat.entity.ChatMessage;
import com.mango.backend.domain.chat.entity.ChatRoom;
import com.mango.backend.domain.chat.repository.ChatMessageRepository;
import com.mango.backend.domain.chat.repository.ChatRoomRepository;
import com.mango.backend.domain.user.entity.User;
import com.mango.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 채팅방 관리 비즈니스 로직 서비스
 * 
 * === 주요 기능 ===
 * 1. 채팅방 생성 및 조회
 * 2. 내 채팅방 목록 조회 (최근 메시지 포함)
 * 3. 채팅방 권한 검증
 * 4. 메시지 히스토리 조회
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    /**
     * 채팅방 생성 또는 기존 채팅방 조회
     * 
     * === 처리 로직 ===
     * 1. 자기 자신과의 채팅 방지
     * 2. user1_id < user2_id 규칙 적용  
     * 3. 기존 채팅방 있으면 반환, 없으면 생성
     * 
     * @param currentUserId 현재 사용자 ID
     * @param targetUserId 채팅 상대방 ID
     * @return 생성/조회된 채팅방 응답 DTO
     */
    @Transactional
    public ChatRoomResponse createOrGetChatRoom(Long currentUserId, Long targetUserId) {
        log.debug("채팅방 생성/조회 요청 - 현재사용자ID: {}, 상대방ID: {}", currentUserId, targetUserId);
        
        // 1. 입력값 검증
        validateCreateChatRoomRequest(currentUserId, targetUserId);
        
        // 2. user1_id < user2_id 규칙 적용
        Long user1Id = Math.min(currentUserId, targetUserId);
        Long user2Id = Math.max(currentUserId, targetUserId);
        
        // 3. 기존 채팅방 조회
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByUser1IdAndUser2Id(user1Id, user2Id);
        
        ChatRoom chatRoom;
        if (existingRoom.isPresent()) {
            // 기존 채팅방 반환
            chatRoom = existingRoom.get();
            log.debug("기존 채팅방 조회 - 채팅방ID: {}", chatRoom.getId());
        } else {
            // 새 채팅방 생성
            chatRoom = ChatRoom.createChatRoom(currentUserId, targetUserId);
            chatRoom = chatRoomRepository.save(chatRoom);
            log.debug("새 채팅방 생성 - 채팅방ID: {}", chatRoom.getId());
        }
        
        // 4. DTO 변환 및 추가 정보 설정
        ChatRoomResponse response = ChatRoomResponse.from(chatRoom, currentUserId);
        
        // User 서비스 연동하여 상대방 정보 설정
        User otherUser = userRepository.findById(response.getOtherUserId())
                .orElse(null);

        String otherUserNickname = otherUser != null ? otherUser.getNickname() : "탈퇴한 사용자";
        String otherUserProfileImage = (otherUser != null && otherUser.getProfilePhoto() != null)
                ? otherUser.getProfilePhoto().getPhotoUrl()
                : "/images/default-profile.png";

        response = response.withOtherUserInfo(otherUserNickname, otherUserProfileImage);
        
        // 5. 마지막 메시지 정보 설정
        setLastMessageInfo(response, currentUserId);
        
        return response;
    }

    /**
     * 내 채팅방 목록 조회
     * 
     * === 정렬 기준 ===
     * - 최근 활동 시간 순 (updatedAt 내림차순)
     * - 최신 메시지가 있는 채팅방이 위로
     * 
     * @param userId 현재 사용자 ID
     * @return 채팅방 목록 (최근 메시지 정보 포함)
     */
    public List<ChatRoomResponse> getMyChatRooms(Long userId) {
        log.debug("내 채팅방 목록 조회 - 사용자ID: {}", userId);
        
        // 1. 내가 참여한 채팅방 목록 조회 (최신 활동 순)
        List<ChatRoom> chatRooms = chatRoomRepository.findByUserIdOrderByUpdatedAtDesc(userId);
        log.debug("조회된 채팅방 개수: {}", chatRooms.size());
        
        // 2. DTO 변환 및 추가 정보 설정
        return chatRooms.stream()
                .map(chatRoom -> {
                    log.debug("채팅방 처리 - 채팅방ID: {}, user1: {}, user2: {}, 요청사용자: {}",
                             chatRoom.getId(), chatRoom.getUser1Id(), chatRoom.getUser2Id(), userId);

                    ChatRoomResponse response = ChatRoomResponse.from(chatRoom, userId);
                    log.debug("응답 DTO 생성 - 채팅방ID: {}, otherUserId: {}",
                             response.getId(), response.getOtherUserId());

                    // User 서비스 연동하여 상대방 정보 설정
                    User otherUser = userRepository.findById(response.getOtherUserId())
                            .orElse(null);

                    String otherUserNickname = otherUser != null ? otherUser.getNickname() : "탈퇴한 사용자";
                    String otherUserProfileImage = (otherUser != null && otherUser.getProfilePhoto() != null)
                            ? otherUser.getProfilePhoto().getPhotoUrl()
                            : "/images/default-profile.png";

                    response = response.withOtherUserInfo(otherUserNickname, otherUserProfileImage);
                    
                    // 마지막 메시지 정보 설정
                    return setLastMessageInfo(response, userId);
                })
                .collect(Collectors.toList());
    }

    /**
     * 채팅방 메시지 히스토리 조회 (페이징)
     * 
     * === 정렬 기준 ===
     * - 메시지 순서 번호 순 (sequenceNumber 오름차순)
     * - 가장 오래된 메시지부터 최신 메시지 순
     * 
     * @param chatRoomId 채팅방 ID
     * @param userId 현재 사용자 ID (권한 검증용)
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지 크기
     * @return 페이징된 메시지 목록
     */
    public Page<ChatMessage> getChatMessages(Long chatRoomId, Long userId, int page, int size) {
        log.debug("채팅 메시지 히스토리 조회 - 채팅방ID: {}, 사용자ID: {}, 페이지: {}, 크기: {}", 
                 chatRoomId, userId, page, size);
        
        // 1. 채팅방 권한 검증
        validateChatRoomAccess(chatRoomId, userId);
        
        // 2. 페이징 설정 (메시지 순서대로 정렬)
        Pageable pageable = PageRequest.of(page, size, Sort.by("sequenceNumber").ascending());
        
        // 3. 메시지 조회 (User 정보 포함)
        Page<ChatMessage> messages = chatMessageRepository.findByChatRoomIdWithSender(chatRoomId, pageable);
        log.debug("조회된 메시지 개수: {} / 전체: {}", messages.getNumberOfElements(), messages.getTotalElements());
        
        return messages;
    }

    /**
     * 채팅방 접근 권한 검증
     * 
     * @param chatRoomId 채팅방 ID
     * @param userId 사용자 ID
     * @return 검증된 채팅방 엔티티
     * @throws IllegalArgumentException 권한이 없거나 채팅방이 없는 경우
     */
    public ChatRoom validateChatRoomAccess(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다. ID: " + chatRoomId));
        
        if (!chatRoom.isParticipant(userId)) {
            throw new IllegalArgumentException("채팅방에 접근할 권한이 없습니다. 사용자ID: " + userId + ", 채팅방ID: " + chatRoomId);
        }
        
        return chatRoom;
    }

    /**
     * 채팅방 생성 요청 검증
     */
    private void validateCreateChatRoomRequest(Long currentUserId, Long targetUserId) {
        if (currentUserId == null) {
            throw new IllegalArgumentException("현재 사용자 ID는 필수입니다.");
        }
        
        if (targetUserId == null) {
            throw new IllegalArgumentException("채팅 상대방 사용자 ID는 필수입니다.");
        }
        
        if (currentUserId.equals(targetUserId)) {
            throw new IllegalArgumentException("자기 자신과는 채팅할 수 없습니다.");
        }
    }

    /**
     * 채팅방 응답에 마지막 메시지 정보 설정
     * 
     * @param response 설정할 채팅방 응답 DTO
     * @param currentUserId 현재 사용자 ID (읽지 않은 메시지 개수 계산용)
     * @return 마지막 메시지 정보가 설정된 응답 DTO
     */
    private ChatRoomResponse setLastMessageInfo(ChatRoomResponse response, Long currentUserId) {
        // 1. 마지막 메시지 조회
        Optional<ChatMessage> lastMessage = chatMessageRepository.findLatestMessageByChatRoomId(response.getId());
        
        if (lastMessage.isPresent()) {
            ChatMessage message = lastMessage.get();
            
            // 2. 메시지 내용 설정 (타입에 따라 다르게 표시)
            String displayContent;
            if ("TEXT".equals(message.getMessageType())) {
                displayContent = message.getContent();
            } else if ("IMAGE".equals(message.getMessageType())) {
                displayContent = "[이미지]";
            } else {
                displayContent = "[메시지]";
            }
            
            // 3. 읽지 않은 메시지 개수 조회
            long unreadCount = chatMessageRepository.countUnreadMessagesByChatRoomIdAndUserId(
                response.getId(), currentUserId);
            
            // 4. 마지막 메시지 정보 설정
            return response.withLastMessageInfo(displayContent, message.getCreatedAt(), unreadCount);
        } else {
            // 메시지가 없는 경우
            return response.withLastMessageInfo(null, null, 0L);
        }
    }
}