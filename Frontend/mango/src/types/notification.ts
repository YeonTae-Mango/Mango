export enum NotificationType {
  NEW_MATCH = 'NEW_MATCH',
  NEW_MESSAGE = 'NEW_MESSAGE',
  MANGO_RECEIVED = 'MANGO_RECEIVED',
  MYDATA_CONNECTED = 'MYDATA_CONNECTED',
}

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  subtitle: string;
  time?: string;
  userId?: string; // 관련된 사용자 ID (매칭, 메시지, 망고 받음의 경우)
  chatRoomId?: string; // 채팅방 ID (메시지의 경우)
}
