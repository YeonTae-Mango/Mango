// 채팅 관련 타입 정의

// 채팅 사용자 정보 인터페이스
export interface ChatUser {
  userId: number;
  nickname: string;
  profilePhotoUrl: string;
  location?: string;
}

// 채팅방 정보 인터페이스
export interface ChatRoom {
  id: number;
  user1Id: number;
  user2Id: number;
  otherUser: ChatUser;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  createdAt: string;
  isBlocked?: boolean; // 차단/신고 상태
}

// 채팅 메시지 인터페이스
export interface ChatMessage {
  id: number;
  chatRoomId: number;
  senderId: number;
  senderNickname: string;
  messageType: 'TEXT' | 'IMAGE';
  content?: string;
  fileUrl?: string;
  sequenceNumber: number;
  isRead: boolean;
  createdAt: string;
}

// 채팅 메시지 응답 인터페이스
export interface ChatMessagesResponse {
  content: ChatMessage[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

// 채팅방 생성 요청 인터페이스
export interface CreateChatRoomRequest {
  targetUserId: number;
}

// 메시지 전송 요청 인터페이스
export interface SendMessageRequest {
  chatRoomId: number;
  content: string;
  messageType: 'TEXT' | 'IMAGE';
}

// 읽음 상태 업데이트 인터페이스
export interface ReadStatusUpdate {
  chatRoomId: number;
  userId: number;
  sequenceNumber: number;
}

// 채팅 알림 데이터 인터페이스 (백엔드 ChatNotificationDTO)
export interface ChatNotificationDTO {
  chatRoomId: number;
  lastMessage: string; // 마지막 메시지 내용
  senderName: string; // 발신자 이름
  senderId: number; // 발신자 ID
  messageType: 'TEXT' | 'IMAGE'; // 메시지 타입
  timestamp: string; // 생성 시간
  unreadCount: number; // 읽지 않은 메시지 수
  notificationType: 'NEW_MESSAGE'; // 알림 타입
}

// 채팅방 목록 업데이트용 데이터 인터페이스
export interface ChatRoomUpdateData {
  chatRoomId: number;
  lastMessage: string;
  lastMessageTime: string;
  senderName: string;
  senderId: number;
  messageType: 'TEXT' | 'IMAGE';
}
