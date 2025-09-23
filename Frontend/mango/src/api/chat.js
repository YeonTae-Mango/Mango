import apiClient from './client';

/**
 * 채팅방을 생성하거나 기존 채팅방을 가져옵니다.
 * @param {number} targetUserId - 대화 상대방 ID
 * @returns {Promise<Object>} API 응답 프로미스
 */
export const createOrGetChatRoom = async targetUserId => {
  try {
    const response = await apiClient.post('/chat/rooms', {
      targetUserId,
    });
    console.log('채팅방 생성/조회 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('채팅방 생성/조회 API 오류:', error);
    throw error;
  }
};

/**
 * 내 채팅방 목록을 가져옵니다.
 * @returns {Promise<Array>} API 응답 프로미스
 */
export const getChatRooms = async () => {
  try {
    const response = await apiClient.get('/chat/rooms');
    console.log('채팅방 목록 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('채팅방 목록 API 오류:', error);
    throw error;
  }
};

/**
 * 특정 채팅방 정보를 가져옵니다.
 * @param {number} roomId - 채팅방 ID
 * @returns {Promise<Object>} API 응답 프로미스
 */
export const getChatRoom = async roomId => {
  try {
    const response = await apiClient.get(`/chat/rooms/${roomId}`);
    console.log('채팅방 정보 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('채팅방 정보 API 오류:', error);
    throw error;
  }
};

/**
 * 채팅방의 메시지 히스토리를 가져옵니다 (페이징).
 * @param {number} roomId - 채팅방 ID
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} size - 페이지 크기 (기본값: 20)
 * @returns {Promise<Object>} API 응답 프로미스
 */
export const getChatMessages = async (roomId, page = 0, size = 20) => {
  try {
    const response = await apiClient.get(`/chat/rooms/${roomId}/messages`, {
      params: {
        page: page,
        size: size,
      },
    });
    console.log('채팅 메시지 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('채팅 메시지 API 오류:', error);
    throw error;
  }
};
