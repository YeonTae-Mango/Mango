import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getSwipeProfiles,
  sendMangoDislike,
  sendMangoLike,
} from '../api/swipe';
import type { SwipeAction, UseSwipeOptions } from '../types/swipe';

export const useSwipe = (userId: number, options: UseSwipeOptions = {}) => {
  const { category, onSwipeSuccess } = options; // 옵션에서 카테고리와 콜백 추출
  const queryClient = useQueryClient(); // React Query 클라이언트
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 프로필 인덱스 상태 관리

  // 프로필 목록을 가져오기 위한 React Query 설정
  const {
    data: profiles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['swipeProfiles', userId, category],
    queryFn: async () => getSwipeProfiles(userId, category),
    enabled: !!userId && userId > 0, // userId가 유효할 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션 방지
  });

  const currentProfile = profiles[currentIndex] || null; // 현재 보여지는 프로필
  const hasMoreProfiles = currentIndex < profiles.length - 1; // 더 볼 프로필이 있는지 여부

  // 스와이프 액션을 처리하는 mutation (좋아요/싫어요)
  const swipeMutation = useMutation({
    mutationFn: async ({ requestId, action }: SwipeAction) => {
      try {
        // 망고 보내기 API 호출
        if (action === 'like') {
          const response = await sendMangoLike(userId, requestId);
          return response;
        }
        // 싫어요 처리 API 호출
        else if (action === 'dislike') {
          const response = await sendMangoDislike(userId, requestId);
          return response;
        }
      } catch (error) {
        console.error(`스와이프 API 호출 실패 (${action}):`, error);
        throw error;
      }
    },
    onSuccess: variables => {
      // API 성공 시 애니메이션 트리거 (버튼 클릭용)
      if (onSwipeSuccess) {
        const direction = variables.action === 'like' ? 'right' : 'left';
        onSwipeSuccess(direction);
      }

      // API 호출 성공 후에만 다음 프로필로 이동
      setCurrentIndex((prev: number) => {
        const nextIndex = prev + 1;
        return nextIndex;
      });
    },
    onError: (error, variables) => {
      console.error(
        `Profile ${variables.requestId} ${variables.action} 실패:`,
        error
      );
      // 에러 발생 시에도 다음 프로필로 이동 (UX 개선)
      setCurrentIndex((prev: number) => {
        const nextIndex = prev + 1;
        console.log(`에러 발생했지만 인덱스 변경: ${prev} -> ${nextIndex}`);
        return nextIndex;
      });
    },
  });

  // 프로필 좋아요
  const likeProfile = (requestId: number) => {
    // 이미 진행 중인 mutation이 있으면 무시
    if (swipeMutation.isPending) {
      return;
    }
    swipeMutation.mutate({ requestId, action: 'like' });
  };

  // 프로필 싫어요
  const dislikeProfile = (requestId: number) => {
    // 이미 진행 중인 mutation이 있으면 무시
    if (swipeMutation.isPending) {
      return;
    }
    swipeMutation.mutate({ requestId, action: 'dislike' });
  };

  // 스와이프 전용 mutation (제스처용)
  const swipeMutationForGesture = useMutation({
    mutationFn: async ({ requestId, action }: SwipeAction) => {
      try {
        if (action === 'like') {
          const response = await sendMangoLike(userId, requestId);
          return response;
        } else if (action === 'dislike') {
          const response = await sendMangoDislike(userId, requestId);
          return response;
        }
      } catch (error) {
        console.error(`스와이프 API 호출 실패 (${action}):`, error);
        throw error;
      }
    },
    onSuccess: variables => {
      // 스와이프는 이미 애니메이션에서 인덱스가 증가했으므로 여기서는 증가 안 함
    },
    onError: (error, variables) => {
      console.error(
        `스와이프 API 실패 - ${variables.requestId} ${variables.action}:`,
        error
      );
      // 에러 시에도 인덱스 증가 안 함 (이미 애니메이션에서 처리됨)
    },
  });

  // 스와이프 전용 함수들
  const likeProfileBySwipe = (requestId: number) => {
    if (swipeMutationForGesture.isPending) {
      return;
    }
    swipeMutationForGesture.mutate({ requestId, action: 'like' });
  };

  const dislikeProfileBySwipe = (requestId: number) => {
    if (swipeMutationForGesture.isPending) {
      return;
    }
    swipeMutationForGesture.mutate({ requestId, action: 'dislike' });
  };

  // 스와이프 완료 후 인덱스 증가
  const completeSwipe = () => {
    setCurrentIndex((prev: number) => {
      const nextIndex = prev + 1;
      return nextIndex;
    });
  };

  // 캐시 무효화 및 새로고침
  const refreshProfiles = () => {
    queryClient.invalidateQueries({
      queryKey: ['swipeProfiles', userId, category],
    });
    setCurrentIndex(0); // 인덱스 초기화
  };

  return {
    // 데이터
    profiles,
    currentProfile,

    // 상태
    isLoading,
    isError,
    error,
    hasMoreProfiles,
    isMutating: swipeMutation.isPending,

    // 액션
    likeProfile,
    dislikeProfile,
    likeProfileBySwipe,
    dislikeProfileBySwipe,
    completeSwipe,
    refreshProfiles,
    refetch,

    // 통계
    totalProfiles: profiles.length,
    currentIndex,
    hasProfiles: profiles.length > 0,
  };
};
