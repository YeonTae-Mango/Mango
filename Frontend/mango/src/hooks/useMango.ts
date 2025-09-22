import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getMangoFollowers, getMangoFollowing } from '../api/mango';
import { MangoFollowingResponse } from '../types/mango';

/**
 * 망고한 사람들의 목록을 가져오는 React Query 훅
 * @param userId - 사용자 ID
 * @param page - 페이지 번호
 * @param options - React Query 옵션
 */
export const useMangoFollowing = (
  userId: number,
  page: number = 0,
  options: Partial<UseQueryOptions<MangoFollowingResponse>> = {}
) => {
  return useQuery({
    queryKey: ['mangoFollowing', userId, page],
    queryFn: () => getMangoFollowing(userId, page),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 30 * 1000, // 30초간만 캐시 유지 (더 자주 업데이트)
    gcTime: 5 * 60 * 1000, // 5분간 메모리에 보관
    refetchOnWindowFocus: true, // 윈도우 포커스시 자동 새로고침
    refetchOnReconnect: true, // 네트워크 재연결시 자동 새로고침
    ...options,
  });
};

/**
 * 나를 망고한 사람들의 목록을 가져오는 React Query 훅
 * @param userId - 사용자 ID
 * @param page - 페이지 번호
 * @param options - React Query 옵션
 */
export const useMangoFollowers = (
  userId: number,
  page: number = 0,
  options: Partial<UseQueryOptions<MangoFollowingResponse>> = {}
) => {
  return useQuery({
    queryKey: ['mangoFollowers', userId, page],
    queryFn: () => getMangoFollowers(userId, page),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 30 * 1000, // 30초간만 캐시 유지 (더 자주 업데이트)
    gcTime: 5 * 60 * 1000, // 5분간 메모리에 보관
    refetchOnWindowFocus: true, // 윈도우 포커스시 자동 새로고침
    refetchOnReconnect: true, // 네트워크 재연결시 자동 새로고침
    ...options,
  });
};
