package com.mango.backend.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import com.mango.backend.global.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.security.Principal;

/**
 * WebSocket 및 STOMP 메시징 설정 클래스
 *
 * === 채팅 시스템 아키텍처 ===
 * 1. 클라이언트 → /ws-chat 엔드포인트로 WebSocket 연결
 * 2. 클라이언트 → /app/chat.message로 메시지 전송 (Application Destination)
 * 3. 서버 → 메시지 처리 후 /topic/chat/{roomId}로 브로드캐스트 (Simple Broker)
 * 4. 구독자들 → 실시간 메시지 수신
 *
 * === STOMP (Simple Text Oriented Messaging Protocol) ===
 * - WebSocket 위에서 동작하는 메시징 프로토콜
 * - 발행/구독(Pub/Sub) 패턴 지원
 * - 메시지 라우팅과 세션 관리 자동화
 *
 * === 메시지 흐름 예시 ===
 * 1. 사용자A: CONNECT /ws-chat
 * 2. 사용자A: SUBSCRIBE /topic/chat/123 (채팅방 123 구독)
 * 3. 사용자B: SEND /app/chat.message (메시지 전송)
 * 4. 서버: 메시지 DB 저장 → /topic/chat/123으로 브로드캐스트
 * 5. 사용자A: 실시간으로 메시지 수신
 */
@Slf4j
@Configuration
@EnableWebSocketMessageBroker // STOMP 메시지 브로커 활성화
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtProvider jwtProvider;

    /**
     * 메시지 브로커 설정
     *
     * === Simple Broker vs External Broker ===
     * - Simple Broker: 메모리 기반, 단일 서버용, 개발/소규모 운영에 적합
     * - External Broker (RabbitMQ/ActiveMQ): 다중 서버, 고가용성, 대규모 운영용
     *
     * === 경로 설계 ===
     * - /topic: 1:N 브로드캐스트 (채팅방 내 모든 사용자에게)
     * - /app: 클라이언트 → 서버 메시지 전송 경로
     *
     * === 확장 시 고려사항 ===
     * - 사용자 증가 시 /queue 경로 추가 (1:1 개인 메시지용)
     * - Redis Pub/Sub이나 RabbitMQ로 확장 가능
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Simple Broker 활성화: /topic 경로로 시작하는 메시지를 구독자들에게 브로드캐스트
        // 예: /topic/chat/123 → 채팅방 123의 모든 구독자에게 메시지 전달
        registry.enableSimpleBroker("/topic");

        // Application Destination 설정: 클라이언트가 서버로 메시지를 보낼 때 사용할 경로 접두사
        // 예: 클라이언트가 /app/chat.message로 전송 → ChatController의 @MessageMapping("/chat.message")로 라우팅
        registry.setApplicationDestinationPrefixes("/app");
    }

    /**
     * STOMP 엔드포인트 등록
     *
     * === WebSocket 연결 과정 ===
     * 1. 브라우저에서 new SockJS('/ws-chat') 호출
     * 2. WebSocket 연결 시도, 실패 시 SockJS가 폴백 제공
     * 3. STOMP 클라이언트가 해당 연결을 통해 메시지 송수신
     *
     * === SockJS 폴백 메커니즘 ===
     * - WebSocket 지원 안하는 구형 브라우저 대응
     * - 네트워크 방화벽이 WebSocket을 막는 환경 대응
     * - Long Polling, XHR Streaming 등으로 자동 폴백
     *
     * === CORS 설정 ===
     * - setAllowedOriginPatterns("*"): 모든 출처 허용 (개발용)
     * - 운영환경에서는 구체적인 도메인 명시 권장
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat") // WebSocket 연결 엔드포인트
                .setAllowedOriginPatterns("*") // CORS 설정: 모든 출처 허용 (개발용)
                .withSockJS(); // SockJS 폴백 지원 활성화
    }

    /**
     * 클라이언트 인바운드 채널 설정
     *
     * === JWT 토큰 인증 처리 ===
     * - WebSocket 연결 시 Authorization 헤더에서 JWT 토큰 추출
     * - 토큰 검증 후 사용자 ID를 Principal로 설정
     * - ChatController에서 Principal을 통해 사용자 인증 정보 접근 가능
     *
     * === 인증 흐름 ===
     * 1. 클라이언트: CONNECT 시 Authorization: Bearer {token} 헤더 전송
     * 2. 인터셉터: JWT 토큰 검증 및 사용자 ID 추출
     * 3. Principal 설정: 이후 메시지 처리에서 사용자 인증 정보 활용
     */
    /**
     * WebSocket 메시지 채널 인터셉터 설정
     *
     * === 배포용 게스트 Principal 방식 ===
     * 1. JWT 토큰이 있고 유효하면 → 정상 사용자로 인증
     * 2. JWT 토큰이 없거나 유효하지 않으면 → 게스트 사용자로 설정
     * 3. Principal이 항상 존재하므로 ChatController에서 NPE 방지
     *
     * === 장점 ===
     * - 예외를 던지지 않아 STOMP 연결이 안정적
     * - 프론트엔드에서 토큰 없이도 테스트 가능
     * - 기존 ChatController 코드 최소 변경
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // CONNECT 메시지에서만 인증 처리 (SUBSCRIBE, SEND 등은 통과)
                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    log.info("🔌 WebSocket CONNECT 시도");

                    // 1단계: Authorization 헤더에서 JWT 토큰 추출
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    log.info("🔑 Authorization 헤더: {}", authHeader != null ? "있음" : "없음");

                    // 2단계: JWT 토큰 검증 및 사용자 인증
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        try {
                            // "Bearer " 접두사 제거하여 순수 토큰만 추출
                            String token = authHeader.substring(7);
                            log.info("🎫 JWT 토큰 추출 성공");

                            // JWT 토큰 유효성 검증
                            if (jwtProvider.validateToken(token)) {
                                // 토큰에서 사용자 ID 추출
                                Long userId = jwtProvider.getUserIdFromToken(token);

                                // Principal 객체 생성: 사용자 ID를 문자열로 저장
                                Principal authenticatedUser = () -> userId.toString();
                                accessor.setUser(authenticatedUser);

                                log.info("✅ JWT 인증 성공 - 사용자ID: {}", userId);
                                return message; // 정상 인증 완료
                            } else {
                                log.warn("❌ JWT 토큰 검증 실패 - 만료되었거나 유효하지 않은 토큰");
                            }
                        } catch (Exception e) {
                            log.error("💥 JWT 토큰 처리 중 오류: {}", e.getMessage());
                        }
                    }

                    // 3단계: JWT 인증 실패 또는 토큰 없음 → 게스트 사용자로 설정
                    // 🎭 핵심: 예외를 던지지 않고 게스트 Principal을 생성
                    Principal guestUser = () -> "guest";
                    accessor.setUser(guestUser);
                    log.info("👤 게스트 사용자로 연결 허용 (JWT 토큰 없음 또는 유효하지 않음)");
                }

                // 모든 메시지 정상 통과 (예외 없음)
                return message;
            }
        });
    }
}