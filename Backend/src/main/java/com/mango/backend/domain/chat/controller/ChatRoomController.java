package com.mango.backend.domain.chat.controller;

import com.mango.backend.domain.chat.dto.request.CreateChatRoomRequest;
import com.mango.backend.domain.chat.dto.response.ChatMessageResponse;
import com.mango.backend.domain.chat.dto.response.ChatRoomResponse;
import com.mango.backend.domain.chat.entity.ChatMessage;
import com.mango.backend.domain.chat.entity.ChatRoom;
import com.mango.backend.domain.chat.service.ChatMessageService;
import com.mango.backend.domain.chat.service.ChatRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * 채팅방 관리 REST API 컨트롤러
 * 
 * === 주요 기능 ===
 * 1. 채팅방 생성/조회
 * 2. 내 채팅방 목록 조회
 * 3. 채팅방 메시지 히스토리 조회
 * 
 * === API 경로 설계 ===
 * - GET /api/v1/chat/rooms: 내 채팅방 목록
 * - POST /api/v1/chat/rooms: 채팅방 생성/조회
 * - GET /api/v1/chat/rooms/{roomId} : 채팅방 입장
 * - GET /api/v1/chat/rooms/{roomId}/messages: 메시지 히스토리
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    /**
     * 내 채팅방 목록 조회
     * 
     * === 응답 형태 ===
     * - 최근 활동 순으로 정렬
     * - 마지막 메시지 및 읽지 않은 개수 포함
     * - 상대방 사용자 정보 포함
     * 
     * === 사용 예시 ===
     * GET /api/v1/chat/rooms
     * Authorization: Bearer jwt-token
     * 
     * @param principal JWT에서 추출한 사용자 정보
     * @return 내 채팅방 목록
     */
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResponse>> getChatRoomList(Principal principal) {
        try {
            // JWT 토큰에서 사용자 ID 추출 (게스트 사용자 지원)
            Long userId = extractUserIdFromPrincipal(principal);
            log.debug("내 채팅방 목록 조회 요청 - 사용자ID: {}", userId);
            
            List<ChatRoomResponse> chatRooms = chatRoomService.getMyChatRooms(userId);
            log.debug("채팅방 목록 조회 완료 - 개수: {}", chatRooms.size());
            
            return ResponseEntity.ok(chatRooms);
            
        } catch (IllegalArgumentException e) {
            log.warn("채팅방 목록 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("채팅방 목록 조회 중 예상치 못한 오류", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 채팅방 생성 또는 기존 채팅방 조회
     * 
     * === 처리 로직 ===
     * - 이미 존재하는 채팅방이면 기존 채팅방 반환
     * - 존재하지 않으면 새로운 채팅방 생성
     * - 자기 자신과의 채팅 방지
     * 
     * === 요청 예시 ===
     * POST /api/v1/chat/rooms
     * Content-Type: application/json
     * Authorization: Bearer jwt-token
     * 
     * {
     *   "targetUserId": 5
     * }
     * 
     * @param request 채팅방 생성 요청 DTO
     * @param principal JWT에서 추출한 사용자 정보
     * @return 생성/조회된 채팅방 정보
     */
    @PostMapping("/rooms")
    public ResponseEntity<ChatRoomResponse> createOrGetChatRoom(
            @Valid @RequestBody CreateChatRoomRequest request,
            Principal principal) {
        try {
            // JWT 토큰에서 사용자 ID 추출 (게스트 사용자 지원)
            Long currentUserId = extractUserIdFromPrincipal(principal);
            log.debug("채팅방 생성/조회 요청 - 현재사용자ID: {}, 상대방ID: {}",
                     currentUserId, request.getTargetUserId());
            
            ChatRoomResponse chatRoom = chatRoomService.createOrGetChatRoom(
                currentUserId, request.getTargetUserId());
            
            log.debug("채팅방 생성/조회 완료 - 채팅방ID: {}", chatRoom.getId());
            return ResponseEntity.ok(chatRoom);
            
        } catch (IllegalArgumentException e) {
            log.warn("채팅방 생성/조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("채팅방 생성/조회 중 예상치 못한 오류", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 채팅방 메시지 히스토리 조회 (페이징)
     * 
     * === 페이징 파라미터 ===
     * - page: 페이지 번호 (0부터 시작, 기본값: 0)
     * - size: 페이지 크기 (기본값: 20)
     * 
     * === 정렬 기준 ===
     * - 메시지 순서 번호 오름차순 (가장 오래된 메시지부터)
     * 
     * === 요청 예시 ===
     * GET /api/v1/chat/rooms/1/messages?page=0&size=20
     * Authorization: Bearer jwt-token
     * 
     * @param roomId 채팅방 ID
     * @param page 페이지 번호 (기본값: 0)
     * @param size 페이지 크기 (기본값: 20)
     * @param principal JWT에서 추출한 사용자 정보
     * @return 페이징된 메시지 목록
     */
    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getChatMessages(
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Principal principal) {
        try {
            // JWT 토큰에서 사용자 ID 추출 (게스트 사용자 지원)
            Long userId = extractUserIdFromPrincipal(principal);
            log.debug("채팅 메시지 히스토리 조회 - 채팅방ID: {}, 사용자ID: {}, 페이지: {}, 크기: {}",
                     roomId, userId, page, size);
            
            // 페이지 크기 제한 (DoS 공격 방지)
            if (size > 100) {
                size = 100;
                log.warn("페이지 크기가 너무 큽니다. 100으로 제한합니다.");
            }
            
            Page<ChatMessage> messages = chatRoomService.getChatMessages(roomId, userId, page, size);

            // ChatMessage -> ChatMessageResponse 변환 (User 연관관계 활용)
            Page<ChatMessageResponse> messageResponses = messages.map(ChatMessageResponse::fromEntity);
            
            log.debug("메시지 히스토리 조회 완료 - 조회된 메시지: {} / 전체: {}", 
                     messageResponses.getNumberOfElements(), messageResponses.getTotalElements());
            
            return ResponseEntity.ok(messageResponses);
            
        } catch (IllegalArgumentException e) {
            log.warn("메시지 히스토리 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("메시지 히스토리 조회 중 예상치 못한 오류", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 채팅방 입장 (채팅방 상세 정보 조회 + 읽음 처리)
     * 
     * === 채팅방 입장 시 처리 과정 ===
     * 1. 채팅방 접근 권한 검증
     * 2. 안 읽은 메시지 모두 읽음 처리
     * 3. 채팅방 기본 정보 반환
     * 4. 클라이언트에서 WebSocket 연결 시작
     * 
     * === 응답 정보 ===
     * - 채팅방 ID, 상대방 정보
     * - 읽음 처리된 메시지 개수
     * - 채팅방 생성/수정 시간
     * 
     * === 요청 예시 ===
     * GET /api/v1/chat/rooms/1
     * Authorization: Bearer jwt-token
     * 
     * @param roomId 채팅방 ID
     * @param principal JWT에서 추출한 사용자 정보
     * @return 채팅방 정보 (읽음 처리 완료)
     */
    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ChatRoomResponse> enterChatRoom(
            @PathVariable Long roomId,
            Principal principal) {
        try {
            Long userId = extractUserIdFromPrincipal(principal);
            log.debug("채팅방 입장 요청 - 채팅방ID: {}, 사용자ID: {}", roomId, userId);
            
            // 1. 채팅방 접근 권한 검증 및 기본 정보 조회
            ChatRoom chatRoom = chatRoomService.validateChatRoomAccess(roomId, userId);
            
            // 2. 안 읽은 메시지 읽음 처리
            int readCount = chatMessageService.markMessagesAsRead(roomId, userId);
            log.debug("읽음 처리 완료 - 읽음처리개수: {}", readCount);
            
            // 3. 채팅방 응답 DTO 생성
            ChatRoomResponse response = ChatRoomResponse.from(chatRoom, userId);
            
            // 4. 상대방 사용자 정보 설정 (User 연관관계 활용)
            // ChatRoom에서 User 정보를 가져와서 상대방 정보 설정 가능
            String otherUserNickname = "User" + response.getOtherUserId(); // 여전히 임시 - ChatRoom에서도 User 연관관계 활용 필요
            String otherUserProfileImage = "/images/default-profile.png";
            response = response.withOtherUserInfo(otherUserNickname, otherUserProfileImage);
            
            // 5. 읽음 처리 후이므로 안 읽은 메시지는 0개
            response = response.withLastMessageInfo(null, null, 0L);
            
            log.debug("채팅방 입장 완료 - 채팅방ID: {}, 사용자ID: {}, 상대방ID: {}", 
                     roomId, userId, response.getOtherUserId());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("채팅방 입장 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("채팅방 입장 중 예상치 못한 오류", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Principal에서 사용자 ID 추출 (게스트 사용자 지원)
     *
     * === 배포용 게스트 Principal 처리 ===
     * 1. JWT 토큰으로 인증된 정상 사용자: Principal.getName()이 사용자 ID 숫자
     * 2. 게스트 사용자: Principal.getName()이 "guest" 문자열
     * 3. Principal이 null인 경우는 이제 발생하지 않음 (Security 필터에서 보장)
     *
     * === 게스트 사용자 ID 규칙 ===
     * - 게스트는 -1L로 설정 (음수로 정상 사용자와 구분)
     * - REST API에서도 동일한 게스트 처리로 WebSocket과 통일성 유지
     * - 실제 프로덕션에서는 게스트 기능을 제한하거나 제거 가능
     *
     * @param principal Security 필터 또는 WebSocket 인터셉터에서 설정된 인증 정보
     * @return 사용자 ID (정상 사용자는 양수, 게스트는 -1L)
     */
    private Long extractUserIdFromPrincipal(Principal principal) {
        // Principal null 체크 (방어 코드 - Security에서 보장하므로 발생하지 않아야 함)
        if (principal == null) {
            log.error("🚨 Principal이 null입니다! Security 설정 오류일 가능성 있음");
            return -1L; // 게스트로 처리
        }

        String principalName = principal.getName();
        log.debug("🔍 Principal 이름 확인: {}", principalName);

        // 게스트 사용자 처리
        if ("guest".equals(principalName)) {
            log.info("👤 게스트 사용자로 REST API 처리 중");
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
}