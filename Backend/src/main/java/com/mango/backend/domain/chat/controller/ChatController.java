package com.mango.backend.domain.chat.controller;

import com.mango.backend.domain.chat.dto.request.ChatMessageRequest;
import com.mango.backend.domain.chat.dto.response.ChatMessageResponse;
import com.mango.backend.domain.chat.dto.response.ChatNotificationDTO;
import com.mango.backend.domain.chat.entity.ChatMessage;
import com.mango.backend.domain.chat.entity.ChatRoom;
import com.mango.backend.domain.chat.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * WebSocket 채팅 메시지 컨트롤러
 * 
 * === WebSocket 메시지 처리 흐름 ===
 * 1. 클라이언트가 /app/chat.message로 메시지 전송
 * 2. 서버에서 메시지를 DB에 저장
 * 3. 저장 성공 시 /topic/chat/{roomId}로 브로드캐스트
 * 4. 해당 채팅방 구독자들이 실시간으로 메시지 수신
 * 
 * === 보안 고려사항 ===
 * - Principal을 통해 인증된 사용자만 메시지 전송 가능
 * - 채팅방 참가자 권한 검증
 * - 메시지 내용 검증 및 필터링
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 텍스트/이미지 메시지 처리
     * 
     * === 클라이언트 전송 방법 ===
     * stompClient.send("/app/chat.message", {}, JSON.stringify({
     *   chatRoomId: 1,
     *   content: "안녕하세요!",
     *   messageType: "TEXT"
     * }));
     * 
     * === 처리 과정 ===
     * 1. 사용자 인증 확인 (Principal)
     * 2. 메시지 타입에 따라 분기 처리
     * 3. DB 저장
     * 4. 실시간 브로드캐스트
     * 5. 에러 발생 시 발신자에게만 에러 메시지 전송
     * 
     * @param request 메시지 요청 데이터
     * @param principal 인증된 사용자 정보 (JWT에서 추출)
     */
    @MessageMapping("/chat-message")
    public void handleChatMessage(ChatMessageRequest request, Principal principal) {
        try {
            // 1. 사용자 ID 추출 (추후 JWT 토큰에서 추출하도록 개선)
            Long senderId = extractUserIdFromPrincipal(principal);
            log.debug("메시지 수신 - 발신자ID: {}, 채팅방ID: {}, 타입: {}", 
                     senderId, request.getChatRoomId(), request.getMessageType());

            // 2. 메시지 타입에 따른 처리
            ChatMessage savedMessage = processMessageByType(request, senderId);

            // 3. 실시간 브로드캐스트
            broadcastMessage(savedMessage);

            log.debug("메시지 처리 완료 - 메시지ID: {}, 순서번호: {}", 
                     savedMessage.getId(), savedMessage.getSequenceNumber());

        } catch (Exception e) {
            log.error("메시지 처리 실패 - 채팅방ID: {}, 에러: {}", request.getChatRoomId(), e.getMessage(), e);

            // 에러 발생 시 발신자에게만 에러 메시지 전송
            String userName = (principal != null) ? principal.getName() : "unknown";
            sendErrorToUser(userName, "메시지 전송에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 메시지 타입에 따른 분기 처리
     * 
     * @param request 메시지 요청
     * @param senderId 발신자 ID
     * @return 저장된 메시지 엔티티
     */
    private ChatMessage processMessageByType(ChatMessageRequest request, Long senderId) {
        String messageType = request.getMessageType() != null ? request.getMessageType() : "TEXT";
        
        return switch (messageType) {
            case "TEXT" -> {
                validateTextMessage(request);
                yield chatMessageService.saveTextMessage(
                    request.getChatRoomId(), 
                    senderId, 
                    request.getContent()
                );
            }
            case "IMAGE" -> {
                validateImageMessage(request);
                yield chatMessageService.saveImageMessage(
                    request.getChatRoomId(), 
                    senderId, 
                    request.getFileUrl(), 
                    request.getContent() // 이미지 설명
                );
            }
            default -> throw new IllegalArgumentException("지원하지 않는 메시지 타입입니다: " + messageType);
        };
    }

    /**
     * 텍스트 메시지 유효성 검증
     */
    private void validateTextMessage(ChatMessageRequest request) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("텍스트 메시지 내용은 필수입니다.");
        }
        
        // 메시지 길이 제한 (예: 1000자)
        if (request.getContent().length() > 1000) {
            throw new IllegalArgumentException("메시지는 1000자를 초과할 수 없습니다.");
        }
    }

    /**
     * 이미지 메시지 유효성 검증
     */
    private void validateImageMessage(ChatMessageRequest request) {
        if (request.getFileUrl() == null || request.getFileUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("이미지 파일 URL은 필수입니다.");
        }
        
        // 이미지 URL 형식 검증 (기본적인 형식만)
        if (!request.getFileUrl().matches("^https?://.*\\.(jpg|jpeg|png|gif|webp)$")) {
            throw new IllegalArgumentException("올바른 이미지 파일 URL이 아닙니다.");
        }
    }

    /**
     * 저장된 메시지를 채팅방 구독자들에게 브로드캐스트
     *
     * === 브로드캐스트 경로 ===
     * /topic/chat/{roomId} → 해당 채팅방을 구독한 모든 클라이언트가 수신
     * /topic/notification/{userId} → 채팅방 밖에서 알림 수신 (새로 추가)
     *
     * === 클라이언트 구독 방법 ===
     * stompClient.subscribe('/topic/chat/1', function(message) {
     *   var chatMessage = JSON.parse(message.body);
     *   // 메시지 화면에 표시
     * });
     *
     * @param savedMessage 저장된 메시지 엔티티
     */
    private void broadcastMessage(ChatMessage savedMessage) {
        // ChatMessage -> ChatMessageResponse 변환 (User 정보 포함)
        // savedMessage는 이미 sender 연관관계가 로드된 상태여야 함
        ChatMessageResponse response = ChatMessageResponse.fromEntity(savedMessage);

        // 1. 채팅방 구독자들에게 브로드캐스트 
        String destination = "/topic/chat/" + savedMessage.getChatRoomId();
        messagingTemplate.convertAndSend(destination, response);

        // 2. 상대방의 개인 알림 채널로도 전송 (채팅방 목록 업데이트용)
        sendNotificationToReceiver(savedMessage, response);

        log.debug("메시지 브로드캐스트 완료 - 채팅방: {}, 메시지ID: {}, 발신자: {}",
                 destination, savedMessage.getId(), response.getSenderNickname());
    }

    /**
     * 상대방에게 채팅 알림 전송 (채팅방 목록 업데이트용)
     *
     * === 알림 전송 흐름 ===
     * 1. 채팅방에서 상대방 ID 추출
     * 2. 간단한 알림 DTO 생성
     * 3. /topic/notification/{userId}로 전송
     *
     * @param savedMessage 저장된 메시지
     * @param response 메시지 응답 DTO
     */
    private void sendNotificationToReceiver(ChatMessage savedMessage, ChatMessageResponse response) {
        try {
            // 채팅방 ID로 채팅방 정보 조회
            Long chatRoomId = savedMessage.getChatRoomId();
            ChatRoom chatRoom = chatMessageService.findChatRoomById(chatRoomId);
            if (chatRoom == null) {
                log.warn("채팅방 정보를 찾을 수 없음 - 알림 전송 스킵");
                return;
            }

            // 상대방 ID 찾기
            Long senderId = savedMessage.getSenderId();
            Long receiverId = chatRoom.getUser1Id().equals(senderId)
                ? chatRoom.getUser2Id()
                : chatRoom.getUser1Id();

            // 알림 DTO 생성
            ChatNotificationDTO notification = ChatNotificationDTO.newMessageNotification(
                chatRoom.getId(),
                savedMessage.getContent(),
                response.getSenderNickname(),
                senderId,
                savedMessage.getMessageType(),
                savedMessage.getCreatedAt()
            );

            // 상대방의 개인 채널로 알림 전송
            String notificationDestination = "/topic/notification/" + receiverId;
            messagingTemplate.convertAndSend(notificationDestination, notification);

            log.debug("알림 전송 완료 - 수신자ID: {}, 채팅방ID: {}", receiverId, chatRoom.getId());

        } catch (Exception e) {
            // 알림 전송 실패해도 메인 메시지 전송은 정상 처리
            log.error("알림 전송 실패 - 메시지ID: {}, 에러: {}", savedMessage.getId(), e.getMessage());
        }
    }

    /**
     * 특정 사용자에게 에러 메시지 전송
     * 
     * @param username 사용자명
     * @param errorMessage 에러 메시지
     */
    private void sendErrorToUser(String username, String errorMessage) {
        String destination = "/topic/chat/error/" + username;
        messagingTemplate.convertAndSend(destination, errorMessage);
        log.debug("에러 메시지 전송 완료 - 사용자: {}, 메시지: {}", username, errorMessage);
    }

    /**
     * Principal에서 사용자 ID 추출 (게스트 사용자 지원)
     *
     * === 배포용 게스트 Principal 처리 ===
     * 1. JWT 토큰으로 인증된 정상 사용자: Principal.getName()이 사용자 ID 숫자
     * 2. 게스트 사용자: Principal.getName()이 "guest" 문자열
     * 3. Principal이 null인 경우는 이제 발생하지 않음 (인터셉터에서 보장)
     *
     * === 게스트 사용자 ID 규칙 ===
     * - 게스트는 -1L로 설정 (음수로 정상 사용자와 구분)
     * - 게스트끼리는 같은 ID를 사용하므로 모든 게스트가 같은 채팅방 공유
     * - 실제 프로덕션에서는 게스트 기능을 제한하거나 제거 가능
     *
     * @param principal WebSocket 인터셉터에서 설정된 인증 정보
     * @return 사용자 ID (정상 사용자는 양수, 게스트는 -1L)
     */
    private Long extractUserIdFromPrincipal(Principal principal) {
        // Principal null 체크 (방어 코드 - 인터셉터에서 보장하므로 발생하지 않아야 함)
        if (principal == null) {
            log.error("🚨 Principal이 null입니다! 인터셉터 오류일 가능성 있음");
            return -1L; // 게스트로 처리
        }

        String principalName = principal.getName();
        log.debug("🔍 Principal 이름 확인: {}", principalName);

        // 게스트 사용자 처리
        if ("guest".equals(principalName)) {
            log.info("👤 게스트 사용자로 메시지 처리 중");
            return -1L; // 게스트 사용자 ID
        }

        // 정상 인증된 사용자 처리 (JWT에서 추출된 사용자 ID)
        try {
            Long userId = Long.parseLong(principalName);
            log.debug("✅ 정상 사용자 ID 추출: {}", userId);
            return userId;
        } catch (NumberFormatException e) {
            // Principal 이름이 숫자도 "guest"도 아닌 경우 (예상치 못한 상황)
            log.error("💥 Principal 이름 파싱 실패: {}. 게스트로 처리합니다.", principalName);
            return -1L; // 안전장치: 게스트로 처리
        }
    }

    /**
     * 메시지 읽음 처리
     * 
     * === 클라이언트 전송 방법 ===
     * stompClient.send("/app/chat.read", {}, JSON.stringify({
     *   chatRoomId: 1
     * }));
     * 
     * @param chatRoomId 채팅방 ID
     * @param principal 인증된 사용자 정보
     */
    @MessageMapping("/chat-read")
    public void markMessagesAsRead(Long chatRoomId, Principal principal) {
        try {
            Long userId = extractUserIdFromPrincipal(principal);
            log.debug("메시지 읽음 처리 - 사용자ID: {}, 채팅방ID: {}", userId, chatRoomId);
            
            // TODO: 읽음 처리 서비스 구현
            // chatMessageService.markMessagesAsRead(chatRoomId, userId);
            
            // 상대방에게 읽음 상태 알림
            String destination = "/topic/chat/" + chatRoomId + "/read";
            messagingTemplate.convertAndSend(destination, userId);
            
        } catch (Exception e) {
            log.error("메시지 읽음 처리 실패 - 채팅방ID: {}, 에러: {}", chatRoomId, e.getMessage(), e);
        }
    }
}