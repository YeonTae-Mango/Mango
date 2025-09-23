import { getAuthToken } from '../api/auth';
class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.subscriptions = new Map(); // 채팅방별 구독 관리
    this.messageCallbacks = new Map(); // 채팅방별 메시지 콜백
    this.readStatusCallbacks = new Map(); // 채팅방별 읽음상태 콜백
    this.connectionCallbacks = []; // 연결상태 변경 콜백
    this.messageId = 0; // STOMP 메시지 ID
    this.sendMessageCallbacks = new Map(); // 메시지 전송 결과 콜백

    // 개인 알림 구독 관련
    this.personalNotificationCallback = null; // 개인 알림 콜백
    this.personalSubscriptionId = null; // 개인 알림 구독 ID
    this.currentUserId = null; // 현재 사용자 ID
  }

  /**
   * WebSocket 연결을 설정합니다
   */
  async connect() {
    if (this.isConnected || this.isConnecting) {
      console.log('🔌 이미 연결되었거나 연결 중입니다');
      return;
    }

    try {
      this.isConnecting = true;
      console.log('🔌 WebSocket 연결 시작...');

      const token = await getAuthToken();
      if (!token) {
        throw new Error('인증 토큰이 없습니다');
      }

      // SockJS 라이브러리를 사용한 연결
      const SockJS = require('sockjs-client');
      const sockjsUrl = 'https://j13a408.p.ssafy.io/dev/ws-chat';

      console.log('🔌 SockJS 라이브러리로 연결 시도...');
      console.log('🔗 SockJS URL:', sockjsUrl);

      // SockJS 클라이언트 사용
      this.socket = new SockJS(sockjsUrl, null, {
        transports: ['websocket', 'xhr-polling', 'xhr-streaming'],
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.socket.onopen = () => {
        console.log('🔌 SockJS 연결 성공');
        this.isConnecting = true;

        // SockJS 연결 후 바로 STOMP CONNECT 프레임 전송
        console.log('📤 STOMP CONNECT 프레임 전송 중...');
        this._sendFrame('CONNECT', {
          'accept-version': '1.0,1.1,2.0',
          'heart-beat': '10000,10000',
          Authorization: `Bearer ${token}`,
          host: 'j13a408.p.ssafy.io',
        });

        // CONNECT 응답 타임아웃 설정 (10초)
        this.connectTimeout = setTimeout(() => {
          if (this.isConnecting && !this.isConnected) {
            console.error('⏰ STOMP CONNECT 타임아웃 - 서버 응답 없음');
            console.log('🔄 다른 헤더로 재시도...');

            // 다른 헤더 형식으로 재시도
            this._sendFrame('CONNECT', {
              'accept-version': '1.2',
              'heart-beat': '0,0',
              Authorization: `Bearer ${token}`,
            });
            setTimeout(() => {
              if (this.isConnecting && !this.isConnected) {
                console.error('❌ STOMP 연결 최종 실패 - 연결 종료');
                this.disconnect();
              }
            }, 5000);
          }
        }, 10000);
      };

      this.socket.onmessage = event => {
        console.log('📥 SockJS 메시지 수신:', event.data);

        // SockJS는 JSON 배열로 메시지를 감쌀 수 있음
        let messageData = event.data;
        if (typeof messageData === 'string' && messageData.startsWith('[')) {
          try {
            const parsed = JSON.parse(messageData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              messageData = parsed[0]; // 첫 번째 메시지 사용
              console.log('📦 SockJS 배열에서 추출된 메시지:', messageData);
            }
          } catch (error) {
            console.log('⚠️ SockJS 메시지 파싱 실패, 원본 사용');
          }
        }

        this._handleMessage(messageData);
      };

      this.socket.onerror = error => {
        console.error('❌ WebSocket 오류:', error);
        this.isConnected = false;
        this.isConnecting = false;
        this._notifyConnectionStatus(false);
      };

      this.socket.onclose = event => {
        console.log('🔌 WebSocket 연결 끊김:', {
          code: event.code,
          reason: event.reason || '이유 없음',
          wasClean: event.wasClean,
          type: event.type,
        });

        // 연결 코드별 상세 정보
        const closeReasons = {
          1000: '정상 종료',
          1001: '서버가 떠남',
          1002: '프로토콜 오류',
          1003: '지원되지 않는 데이터',
          1005: '상태 코드 없음',
          1006: '비정상 종료 (방화벽/프록시 문제 가능)',
          1007: '잘못된 데이터',
          1008: '정책 위반',
          1009: '메시지가 너무 큼',
          1010: '확장 협상 실패',
          1011: '서버 오류',
        };

        console.log(
          `📋 종료 이유: ${closeReasons[event.code] || '알 수 없는 이유'}`
        );

        this.isConnected = false;
        this.isConnecting = false;
        this._notifyConnectionStatus(false);
      };
    } catch (error) {
      console.error('❌ WebSocket 연결 실패:', error);
      this.isConnecting = false;
      this._notifyConnectionStatus(false);
      throw error;
    }
  }

  /**
   * STOMP 프레임을 전송합니다
   * @private
   */
  _sendFrame(command, headers = {}, body = '') {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error(
        '❌ WebSocket이 연결되지 않았습니다, readyState:',
        this.socket?.readyState
      );
      return;
    }

    let frame = command + '\n';
    Object.keys(headers).forEach(key => {
      frame += `${key}:${headers[key]}\n`;
    });
    frame += '\n' + body + '\0';

    console.log('📤 STOMP 프레임 전송:', {
      command,
      headers,
      body: body.substring(0, 100),
    });
    console.log('📤 전체 프레임:', frame.replace('\0', '\\0'));

    // SockJS는 직접 문자열 전송 (JSON 배열 감싸지 않음)
    console.log('📤 SockJS 직접 전송:', frame.replace('\0', '\\0'));

    this.socket.send(frame);
  }

  /**
   * 수신된 메시지를 처리합니다
   * @private
   */
  _handleMessage(data) {
    console.log('📥 원본 메시지 수신:', data);

    // SockJS 초기화 메시지 처리
    if (data === 'o') {
      console.log('✅ SockJS 연결 초기화됨');
      return;
    }

    // SockJS 하트비트 처리
    if (data === 'h') {
      console.log('💓 SockJS 하트비트 수신');
      return;
    }

    // SockJS 메시지 배열 형태 처리 (예: ["CONNECTED\n..."])
    if (data.startsWith('a[')) {
      try {
        const messages = JSON.parse(data.substring(1)); // 'a' 제거 후 JSON 파싱
        messages.forEach(message => {
          console.log('📥 SockJS 메시지:', message);
          this._processSockjsMessage(message);
        });
        return;
      } catch (error) {
        console.error('❌ SockJS 메시지 파싱 오류:', error);
      }
    }

    // 일반 STOMP 메시지 처리
    this._processSockjsMessage(data);
  }

  _processSockjsMessage(data) {
    const frames = data.split('\0');

    frames.forEach(frameData => {
      if (!frameData.trim()) return;

      console.log('📥 프레임 데이터:', frameData);
      const frame = this._parseFrame(frameData);
      console.log('📥 STOMP 프레임 파싱됨:', {
        command: frame.command,
        headers: frame.headers,
        body: frame.body.substring(0, 100),
      });

      switch (frame.command) {
        case 'CONNECTED':
          console.log('✅ STOMP 연결 완료');
          this.isConnected = true;
          this.isConnecting = false;

          // 연결 타임아웃 제거
          if (this.connectTimeout) {
            clearTimeout(this.connectTimeout);
            this.connectTimeout = null;
          }

          this._notifyConnectionStatus(true);
          break;
        case 'MESSAGE':
          this._handleStompMessage(frame);
          break;
        case 'ERROR':
          console.error('❌ STOMP 오류:', frame.headers, frame.body);
          this.isConnected = false;
          this.isConnecting = false;
          this._notifyConnectionStatus(false);
          break;
      }
    });
  }

  /**
   * STOMP 프레임을 파싱합니다
   * @private
   */
  _parseFrame(data) {
    const lines = data.split('\n');
    const command = lines[0];
    const headers = {};
    let bodyStart = 1;

    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '') {
        bodyStart = i + 1;
        break;
      }
      const colonIndex = lines[i].indexOf(':');
      if (colonIndex > 0) {
        const key = lines[i].substring(0, colonIndex);
        const value = lines[i].substring(colonIndex + 1);
        headers[key] = value;
      }
    }

    const body = lines.slice(bodyStart).join('\n');
    return { command, headers, body };
  }

  /**
   * STOMP MESSAGE 프레임을 처리합니다
   * @private
   */
  _handleStompMessage(frame) {
    const destination = frame.headers.destination;
    console.log(`📬 STOMP 메시지 수신 - 목적지: ${destination}`);

    // 개인 알림 메시지 처리
    const notificationMatch = destination.match(
      /\/topic\/notification\/(\d+)$/
    );
    if (notificationMatch) {
      const userId = parseInt(notificationMatch[1]);
      console.log(`🔔 사용자 ${userId}의 개인 알림 수신`);

      if (this.personalNotificationCallback) {
        try {
          const notification = JSON.parse(frame.body);
          console.log(`📩 개인 알림 내용:`, notification);
          this.personalNotificationCallback(notification);
        } catch (error) {
          console.error('❌ 개인 알림 파싱 오류:', error);
          console.error('📄 원본 알림 body:', frame.body);
        }
      } else {
        console.log(`⚠️ 개인 알림에 대한 콜백이 없습니다`);
      }
      return;
    }

    // 채팅방 메시지 처리
    const chatRoomMatch = destination.match(/\/topic\/chat\/(\d+)$/);
    if (chatRoomMatch) {
      const roomId = parseInt(chatRoomMatch[1]);
      console.log(`💬 채팅방 ${roomId} 메시지 수신`);

      const callback = this.messageCallbacks.get(roomId);
      if (callback) {
        try {
          const message = JSON.parse(frame.body);
          console.log(`📩 메시지 내용:`, message);
          callback(message);
        } catch (error) {
          console.error('❌ 메시지 파싱 오류:', error);
          console.error('📄 원본 메시지 body:', frame.body);
        }
      } else {
        console.log(`⚠️ 채팅방 ${roomId}에 대한 콜백이 없습니다`);
        console.log(
          `📋 현재 구독중인 방들:`,
          Array.from(this.messageCallbacks.keys())
        );
      }
    }

    // 읽음상태 메시지 처리
    const readMatch = destination.match(/\/topic\/chat\/(\d+)\/read$/);
    if (readMatch) {
      const roomId = parseInt(readMatch[1]);
      console.log(`👀 채팅방 ${roomId} 읽음상태 변경`);

      const callback = this.readStatusCallbacks.get(roomId);
      if (callback) {
        try {
          const readStatus = JSON.parse(frame.body);
          console.log(`📖 읽음상태:`, readStatus);
          callback(readStatus);
        } catch (error) {
          console.error('❌ 읽음상태 파싱 오류:', error);
        }
      }
    }
  }

  /**
   * WebSocket 연결을 해제합니다
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 WebSocket 연결 해제 중...');

      // 연결 타임아웃 정리
      if (this.connectTimeout) {
        clearTimeout(this.connectTimeout);
        this.connectTimeout = null;
      }

      // 모든 구독 해제
      this.subscriptions.clear();
      this.messageCallbacks.clear();
      this.readStatusCallbacks.clear();

      // 개인 알림 구독도 해제
      this.personalSubscriptionId = null;
      this.personalNotificationCallback = null;
      this.currentUserId = null;

      // DISCONNECT 프레임 전송 (연결된 경우에만)
      if (this.isConnected) {
        this._sendFrame('DISCONNECT');
      }

      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      this.isConnecting = false;
    }
  }

  /**
   * 개인 알림에 구독합니다 (채팅방 목록 실시간 업데이트용)
   * @param {number} userId - 사용자 ID
   * @param {function} onNotification - 알림 수신 콜백
   */
  subscribeToPersonalNotifications(userId, onNotification) {
    if (!this.isConnected) {
      console.error('❌ WebSocket이 연결되지 않았습니다 - 개인 알림 구독 실패');
      throw new Error('WebSocket이 연결되지 않았습니다');
    }

    // 이미 구독중인지 확인
    if (this.personalSubscriptionId && this.currentUserId === userId) {
      console.log(`📱 사용자 ${userId}의 개인 알림은 이미 구독중입니다`);
      // 기존 콜백 업데이트
      this.personalNotificationCallback = onNotification;
      return;
    }

    try {
      console.log(`🔔 사용자 ${userId}의 개인 알림 구독 시작`);
      console.log(`🔗 구독 목적지: /topic/notification/${userId}`);

      // 개인 알림 구독 - STOMP SUBSCRIBE 프레임 전송
      const subscriptionId = `sub-notification-${userId}-${Date.now()}`;

      console.log(`📤 개인 알림 SUBSCRIBE 프레임 전송 - ID: ${subscriptionId}`);
      this._sendFrame('SUBSCRIBE', {
        id: subscriptionId,
        destination: `/topic/notification/${userId}`,
      });

      // 구독 정보 저장
      this.personalSubscriptionId = subscriptionId;
      this.personalNotificationCallback = onNotification;
      this.currentUserId = userId;

      console.log(`✅ 사용자 ${userId}의 개인 알림 구독 완료`);
    } catch (error) {
      console.error(`❌ 사용자 ${userId}의 개인 알림 구독 실패:`, error);
      throw error;
    }
  }

  /**
   * 개인 알림 구독을 해제합니다
   */
  unsubscribeFromPersonalNotifications() {
    if (this.personalSubscriptionId) {
      console.log(`🔔 사용자 ${this.currentUserId}의 개인 알림 구독 해제`);

      // STOMP UNSUBSCRIBE 프레임 전송
      this._sendFrame('UNSUBSCRIBE', {
        id: this.personalSubscriptionId,
      });

      this.personalSubscriptionId = null;
      this.personalNotificationCallback = null;
      this.currentUserId = null;

      console.log(`✅ 개인 알림 구독 해제 완료`);
    }
  }

  /**
   * 채팅방에 구독합니다
   * @param {number} roomId - 채팅방 ID
   * @param {function} onMessage - 메시지 수신 콜백
   * @param {function} onReadStatus - 읽음상태 변경 콜백 (선택)
   */
  subscribeToRoom(roomId, onMessage, onReadStatus = null) {
    if (!this.isConnected) {
      console.error('❌ WebSocket이 연결되지 않았습니다 - 구독 실패');
      throw new Error('WebSocket이 연결되지 않았습니다');
    }

    // 이미 구독중인지 확인
    if (this.subscriptions.has(roomId)) {
      console.log(`📱 채팅방 ${roomId}는 이미 구독중입니다`);
      // 기존 콜백을 업데이트
      this.messageCallbacks.set(roomId, onMessage);
      if (onReadStatus) {
        this.readStatusCallbacks.set(roomId, onReadStatus);
      }
      return;
    }

    try {
      console.log(`📱 채팅방 ${roomId} 구독 시작`);
      console.log(`🔗 구독 목적지: /topic/chat/${roomId}`);

      // 메시지 구독 - STOMP SUBSCRIBE 프레임 전송
      const subscriptionId = `sub-${roomId}-${Date.now()}`;

      console.log(`📤 SUBSCRIBE 프레임 전송 - ID: ${subscriptionId}`);
      this._sendFrame('SUBSCRIBE', {
        id: subscriptionId,
        destination: `/topic/chat/${roomId}`,
      });

      // 구독 정보 저장
      this.subscriptions.set(roomId, subscriptionId);
      this.messageCallbacks.set(roomId, onMessage);

      // 읽음상태 구독 (선택사항)
      if (onReadStatus) {
        const readSubscriptionId = `sub-read-${roomId}-${Date.now()}`;
        console.log(
          `📤 읽음상태 SUBSCRIBE 프레임 전송 - ID: ${readSubscriptionId}`
        );
        this._sendFrame('SUBSCRIBE', {
          id: readSubscriptionId,
          destination: `/topic/chat/${roomId}/read`,
        });
        this.readStatusCallbacks.set(roomId, onReadStatus);
      }

      console.log(`✅ 채팅방 ${roomId} 구독 완료`);
      console.log(
        `📊 현재 구독중인 방: ${Array.from(this.subscriptions.keys()).join(', ')}`
      );
    } catch (error) {
      console.error(`❌ 채팅방 ${roomId} 구독 실패:`, error);
      throw error;
    }
  }

  /**
   * 채팅방 구독을 해제합니다
   * @param {number} roomId - 채팅방 ID
   */
  unsubscribeFromRoom(roomId) {
    const subscriptionId = this.subscriptions.get(roomId);
    if (subscriptionId) {
      // STOMP UNSUBSCRIBE 프레임 전송
      this._sendFrame('UNSUBSCRIBE', {
        id: subscriptionId,
      });

      this.subscriptions.delete(roomId);
      this.messageCallbacks.delete(roomId);
      this.readStatusCallbacks.delete(roomId);
      console.log(`📱 채팅방 ${roomId} 구독 해제 완료`);
    }
  }

  /**
   * 메시지를 전송합니다
   * @param {number} roomId - 채팅방 ID
   * @param {string} content - 메시지 내용
   * @param {string} messageType - 메시지 타입 ('TEXT' | 'IMAGE')
   * @param {function} onSuccess - 전송 성공 콜백 (선택사항)
   * @param {function} onError - 전송 실패 콜백 (선택사항)
   */
  sendMessage(
    roomId,
    content,
    messageType = 'TEXT',
    onSuccess = null,
    onError = null
  ) {
    if (!this.isConnected) {
      console.error('❌ WebSocket이 연결되지 않았습니다 - 메시지 전송 불가');
      throw new Error('WebSocket이 연결되지 않았습니다');
    }

    // 입력값 검증
    if (!roomId || roomId <= 0) {
      console.error('❌ 잘못된 채팅방 ID:', roomId);
      throw new Error('유효하지 않은 채팅방 ID입니다');
    }

    if (!content || content.trim().length === 0) {
      console.error('❌ 메시지 내용이 비어있습니다');
      throw new Error('메시지 내용을 입력해주세요');
    }

    try {
      const message = {
        chatRoomId: roomId,
        content: content.trim(),
        messageType: messageType,
      };

      console.log(`📤 메시지 전송 시작 - 채팅방: ${roomId}`);
      console.log(`💬 메시지 내용: "${content}"`);
      console.log(`📋 메시지 타입: ${messageType}`);
      console.log(`🔗 전송 목적지: /app/chat-message`);

      // STOMP SEND 프레임 전송
      this._sendFrame(
        'SEND',
        {
          destination: '/app/chat-message',
          'content-type': 'application/json',
        },
        JSON.stringify(message)
      );

      console.log(`✅ 메시지 전송 완료 - 채팅방 ${roomId}`);

      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess({
          success: true,
          roomId,
          content,
          messageType,
          timestamp: new Date().toISOString(),
        });
      }

      // 전송된 메시지 정보 반환 (필요시 사용)
      return {
        success: true,
        roomId,
        content,
        messageType,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`❌ 메시지 전송 실패 - 채팅방 ${roomId}:`, error);
      console.error('📄 전송하려던 메시지:', { roomId, content, messageType });

      // 에러 콜백 호출
      if (onError) {
        onError({
          success: false,
          error: error.message || '메시지 전송 실패',
          roomId,
          content,
          messageType,
        });
      }

      throw error;
    }
  }

  /**
   * 연결 상태 변경 콜백을 등록합니다
   * @param {function} callback - 연결 상태 변경 콜백 (isConnected) => {}
   */
  onConnectionStatusChange(callback) {
    this.connectionCallbacks.push(callback);
  }

  /**
   * 연결 상태 변경을 알립니다
   * @private
   */
  _notifyConnectionStatus(isConnected) {
    console.log(
      `🔌 WebSocket 상태 변경: ${isConnected ? '연결됨' : '연결 끊김'}`
    );
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(isConnected);
      } catch (error) {
        console.error('❌ 연결상태 콜백 오류:', error);
      }
    });
  }

  /**
   * 현재 연결 상태를 반환합니다
   */
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      connecting: this.isConnecting,
    };
  }

  /**
   * 연결 상태를 테스트합니다
   */
  async testConnection() {
    console.log('🧪 WebSocket 연결 테스트 시작...');
    console.log('현재 상태:', this.getConnectionStatus());

    // 기존 연결이 있다면 먼저 종료
    if (this.socket) {
      console.log('🔌 기존 연결 종료 중...');
      this.disconnect();
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
    }

    console.log('🔌 새로운 연결 시도 중...');
    await this.connect();

    // 5초 후 상태 확인
    setTimeout(() => {
      console.log('🧪 테스트 결과:', {
        연결상태: this.isConnected ? '✅ 연결됨' : '❌ 연결안됨',
        연결중: this.isConnecting ? '⏳ 연결중' : '⏹️ 대기중',
        구독방수: this.subscriptions.size,
        WebSocket상태: this.socket ? this.socket.readyState : '없음',
      });

      // 연결이 안 되었다면 추가 디버깅 정보
      if (!this.isConnected) {
        console.log('🔍 추가 디버깅 정보:');
        console.log('- WebSocket readyState:', this.socket?.readyState);
        console.log('- WebSocket URL:', this.socket?.url);
      }
    }, 5000);
  }
}

// 싱글톤 인스턴스 생성
const chatService = new ChatService();

export default chatService;
