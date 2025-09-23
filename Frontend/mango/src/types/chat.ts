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
