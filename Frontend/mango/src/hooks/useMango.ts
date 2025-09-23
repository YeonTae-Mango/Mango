import {
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { getMangoFollowers, getMangoFollowing } from '../api/mango';
import { useAuthStore } from '../store/authStore';
import { MangoFollowingResponse } from '../types/mango';

/**
 * 망고한 사람들의 목록을 가져오는 React Query 훅 (로그인된 사용자 기준)
 * @param page - 페이지 번호
 * @param options - React Query 옵션
 */
export const useMangoFollowing = (
  page: number = 0,
  options: Partial<UseQueryOptions<MangoFollowingResponse>> = {}
) => {
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ['mangoFollowing', userId, page],
    queryFn: () => getMangoFollowing(userId!, page),
    enabled: isAuthenticated && !!userId, // 인증되고 userId가 있을 때만 쿼리 실행
    staleTime: 30 * 1000, // 30초간만 캐시 유지 (더 자주 업데이트)
    gcTime: 5 * 60 * 1000, // 5분간 메모리에 보관
    refetchOnWindowFocus: true, // 윈도우 포커스시 자동 새로고침
    refetchOnReconnect: true, // 네트워크 재연결시 자동 새로고침
    ...options,
  });
};

/**
 * 나를 망고한 사람들의 목록을 가져오는 React Query 훅 (로그인된 사용자 기준)
 * @param page - 페이지 번호
 * @param options - React Query 옵션
 */
export const useMangoFollowers = (
  page: number = 0,
  options: Partial<UseQueryOptions<MangoFollowingResponse>> = {}
) => {
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ['mangoFollowers', userId, page],
    queryFn: () => getMangoFollowers(userId!, page),
    enabled: isAuthenticated && !!userId, // 인증되고 userId가 있을 때만 쿼리 실행
    staleTime: 30 * 1000, // 30초간만 캐시 유지 (더 자주 업데이트)
    gcTime: 5 * 60 * 1000, // 5분간 메모리에 보관
    refetchOnWindowFocus: true, // 윈도우 포커스시 자동 새로고침
    refetchOnReconnect: true, // 네트워크 재연결시 자동 새로고침
    ...options,
  });
};

/**
 * 내가 망고한 사람들의 무한 스크롤 목록을 가져오는 React Query 훅
 */
export const useInfiniteMangoFollowing = () => {
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.id;

  return useInfiniteQuery({
    queryKey: ['infiniteMangoFollowing', userId],
    queryFn: ({ pageParam = 0 }) => {
      return getMangoFollowing(userId!, pageParam);
    },
    enabled: isAuthenticated && !!userId,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (
        lastPage?.data &&
        Array.isArray(lastPage.data) &&
        lastPage.data.length >= 10
      ) {
        const nextPage = allPages.length;
        return nextPage;
      }
      return undefined;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * 나를 망고한 사람들의 무한 스크롤 목록을 가져오는 React Query 훅
 */
export const useInfiniteMangoFollowers = () => {
  const { user, isAuthenticated } = useAuthStore();
  const userId = user?.id;

  return useInfiniteQuery({
    queryKey: ['infiniteMangoFollowers', userId],
    queryFn: ({ pageParam = 0 }) => {
      console.log('훅: Followers API 호출, pageParam:', pageParam);
      return getMangoFollowers(userId!, pageParam);
    },
    enabled: isAuthenticated && !!userId,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (
        lastPage?.data &&
        Array.isArray(lastPage.data) &&
        lastPage.data.length >= 10
      ) {
        const nextPage = allPages.length;
        return nextPage;
      }
      return undefined;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
