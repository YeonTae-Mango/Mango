import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getSwipeProfiles,
  sendMangoDislike,
  sendMangoLike,
} from '../api/swipe';

import type { SwipeAction, UseSwipeOptions } from '../types/swipe';

export const useSwipe = (userId: number, options: UseSwipeOptions = {}) => {
  const { category, onSwipeSuccess, onMatchSuccess } = options; // 옵션에서 카테고리와 콜백 추출
  const queryClient = useQueryClient(); // React Query 클라이언트
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 프로필 인덱스 상태 관리

  // 디버깅을 위한 로그
  console.log('useSwipe Debug:', {
    userId,
    category,
    enabled: !!userId && userId > 0,
  });

  // 프로필 목록을 가져오기 위한 React Query 설정
  const {
    data: profiles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['swipeProfiles', userId, category],
    queryFn: async () => {
      console.log('API 호출:', { userId, category });
      const result = await getSwipeProfiles(userId, category);
      console.log('API 응답:', result);
      return result;
    },
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
    onSuccess: (data, variables) => {
      console.log('🚀 useSwipe onSuccess 호출됨:', {
        data,
        variables,
        onMatchSuccess: !!onMatchSuccess,
      });

      // API 성공 시 애니메이션 트리거 (버튼 클릭용)
      if (onSwipeSuccess) {
        const direction = variables.action === 'like' ? 'right' : 'left';
        onSwipeSuccess(direction);
      }

      // 매치 성공 확인 (좋아요인 경우에만)
      if (variables.action === 'like' && data && onMatchSuccess) {
        console.log('🔍 스와이프 좋아요 응답 확인:', data);
        console.log('🔍 응답 전체 구조:', JSON.stringify(data, null, 2));
        console.log('🔍 현재 프로필:', currentProfile);
        console.log('🔍 현재 프로필의 theyLiked:', currentProfile?.theyLiked);

        // 매칭 조건 확인
        let isMatched = false;

        // 1. API 응답에서 매칭 필드 확인
        const possibleMatchFields = [
          data.matched,
          data.isMatched,
          data.match,
          data.isMatch,
          data.success && data.matched,
          data.data?.matched,
          data.data?.isMatched,
          data.data?.match,
          data.result?.matched,
          data.message === 'match' || data.message === '매치',
          data.status === 'match' || data.status === 'matched',
          // 메시지에서 매칭 키워드 찾기
          data.message?.includes('매치') || data.message?.includes('match'),
          data.message?.includes('서로') || data.message?.includes('mutual'),
        ];

        console.log('🔍 매치 필드 검사:', possibleMatchFields);
        isMatched = possibleMatchFields.some(field => field === true);

        // 2. 현재 프로필이 "나를 망고한 사람"(theyLiked: true)이면 무조건 매칭!
        if (currentProfile?.theyLiked === true) {
          console.log('🎯 "나를 망고한 사람"에게 망고 보냄 -> 자동 매칭!');
          isMatched = true;
        }

        if (isMatched && currentProfile) {
          console.log('🎉 매치 성공!', currentProfile);
          onMatchSuccess(currentProfile);
        } else {
          console.log('👍 좋아요 성공, 매치는 아님');
          console.log('👍 매치 검사 결과:', {
            isMatched,
            hasCurrentProfile: !!currentProfile,
            theyLiked: currentProfile?.theyLiked,
          });
        }
      } // API 호출 성공 후에만 다음 프로필로 이동
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
    onSuccess: (data, variables) => {
      console.log('🎭 스와이프 onSuccess 호출됨:', {
        data,
        variables,
        onMatchSuccess: !!onMatchSuccess,
      });

      // 매치 성공 확인 (좋아요인 경우에만)
      if (variables.action === 'like' && data && onMatchSuccess) {
        console.log('🎭 스와이프 좋아요 응답 확인:', data);
        console.log('🎭 현재 프로필:', currentProfile);
        console.log('🎭 현재 프로필의 theyLiked:', currentProfile?.theyLiked);

        // 매칭 조건 확인
        let isMatched = false;

        // 1. API 응답에서 매칭 필드 확인
        const possibleMatchFields = [
          data.matched,
          data.isMatched,
          data.match,
          data.isMatch,
          data.message?.includes('매치') || data.message?.includes('match'),
        ];

        console.log('🎭 매치 필드 검사:', possibleMatchFields);
        isMatched = possibleMatchFields.some(field => field === true);

        // 2. 현재 프로필이 "나를 망고한 사람"(theyLiked: true)이면 무조건 매칭!
        if (currentProfile?.theyLiked === true) {
          console.log(
            '🎭🎯 "나를 망고한 사람"에게 스와이프 망고 -> 자동 매칭!'
          );
          isMatched = true;
        }

        if (isMatched && currentProfile) {
          console.log('🎭🎉 스와이프 매치 성공!', currentProfile);
          onMatchSuccess(currentProfile);
        } else {
          console.log('🎭👍 스와이프 좋아요 성공, 매치는 아님');
        }
      }

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
