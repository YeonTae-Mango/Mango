import { getAuthToken } from './auth';
import apiClient from './client';

/**
 * 사용자의 카테고리별 소비 패턴 차트를 조회합니다.
 * @param {number} userId - 사용자 ID
 * @param {number} period - 기간 (1: 이번달, 2: 저번달, 3: 최근 6개월)
 * @returns {Promise<CategoryChartResponse>} API 응답 프로미스
 */
export const getMyCategoryChart = async (userId, period = 1) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/chart/myCategoryChart/${userId}`, {
      params: {
        period: period
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('카테고리 차트 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('카테고리 차트 API 오류:', error);
    throw error;
  }
};

/**
 * 사용자의 월별 소비 패턴 차트를 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<MonthlyChartResponse>} API 응답 프로미스
 */
export const getMyMonthlyChart = async (userId) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/chart/myMonthlyChart/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('월별 차트 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('월별 차트 API 오류:', error);
    throw error;
  }
};

/**
 * 사용자의 키워드 분석 차트를 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<KeywordChartResponse>} API 응답 프로미스
 */
export const getMyKeywordChart = async (userId) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/chart/myKeywordChart/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('키워드 차트 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('키워드 차트 API 오류:', error);
    throw error;
  }
};

/**
 * 사용자의 시간대별 소비 패턴 차트를 조회합니다.
 * (두 userId를 모두 같은 사람으로 넣어서 한 명의 데이터를 받음)
 * @param {number} userId - 사용자 ID
 * @returns {Promise<TimeChartResponse>} API 응답 프로미스
 */
export const getMyTimeChart = async (userId) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/chart/twoTimeChart/${userId}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('시간대 차트 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('시간대 차트 API 오류:', error);
    throw error;
  }
};

/**
 * 두 사용자의 시간대 비교 차트를 조회합니다.
 * @param {number} myUserId - 내 사용자 ID
 * @param {number} otherUserId - 비교할 사용자 ID
 * @returns {Promise<TwoTimeChartResponse>} API 응답 프로미스
 */
export const getTwoTimeChart = async (myUserId, otherUserId) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/chart/twoTimeChart/${myUserId}/${otherUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('두 시간대 비교 차트 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('두 시간대 비교 차트 API 오류:', error);
    throw error;
  }
};

/**
 * 사용자의 이번 달 소비 내역 차트를 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<HistoryChartResponse>} API 응답 프로미스
 */
export const getMyHistoryChart = async (userId) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/chart/myThisMonthChart/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('소비 내역 차트 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('소비 내역 차트 API 오류:', error);
    throw error;
  }
};

/**
 * 두 사용자의 카테고리 비교 차트를 조회합니다.
 * @param {number} myUserId - 내 사용자 ID
 * @param {number} otherUserId - 비교할 사용자 ID
 * @returns {Promise<TwoCategoryChartResponse>} API 응답 프로미스
 */
export const getTwoCategoryChart = async (myUserId, otherUserId) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/chart/twoCategoryChart/${myUserId}/${otherUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('두 카테고리 비교 차트 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('두 카테고리 비교 차트 API 오류:', error);
    throw error;
  }
};

/**
 * 두 사용자의 키워드 비교 차트를 조회합니다.
 * @param {number} myUserId - 내 사용자 ID
 * @param {number} otherUserId - 비교할 사용자 ID
 * @returns {Promise<TwoKeywordChartResponse>} API 응답 프로미스
 */
export const getTwoKeywordChart = async (myUserId, otherUserId) => {
  try {
    const token = await getAuthToken();
    const response = await apiClient.get(`/chart/twoKeywordChart/${myUserId}/${otherUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('두 키워드 비교 차트 API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('두 키워드 비교 차트 API 오류:', error);
    throw error;
  }
};
