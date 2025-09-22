package com.mango.backend.domain.chat.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 채팅 메시지 전송 요청 DTO
 * 
 * === 클라이언트에서 서버로 메시지 전송 시 사용 ===
 * WebSocket을 통해 /app/chat.message로 전송되는 데이터
 * 
 * === 사용 예시 ===
 * {
 *   "chatRoomId": 1,
 *   "content": "안녕하세요!",
 *   "messageType": "TEXT"
 * }
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {

    /**
     * 채팅방 ID - 어느 채팅방에 메시지를 보낼지 지정
     */
    @NotNull(message = "채팅방 ID는 필수입니다.")
    private Long chatRoomId;

    /**
     * 메시지 내용 - 텍스트 메시지의 경우 필수, 이미지 메시지의 경우 선택사항
     */
    private String content;

    /**
     * 메시지 타입 - "TEXT" (기본값) or "IMAGE"
     */
    private String messageType = "TEXT";

    /**
     * 파일 URL (이미지 메시지인 경우) - 이미지 업로드 API를 통해 먼저 업로드 후 받은 URL
     */
    private String fileUrl;
}