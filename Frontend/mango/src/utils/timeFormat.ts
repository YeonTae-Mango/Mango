/**
 * 날짜 문자열을 상대적인 시간 표현으로 변환합니다
 * @param dateString ISO 형식의 날짜 문자열
 * @returns 상대적 시간 표현 (예: "방금", "5분 전", "2시간 전", "12월 25일")
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) {
    return '방금';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInMinutes < 1440) {
    // 24시간
    return `${Math.floor(diffInMinutes / 60)}시간 전`;
  } else {
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  }
};

/**
 * 날짜 문자열을 시:분 형식으로 변환합니다
 * @param dateString ISO 형식의 날짜 문자열
 * @returns "오후 3:30" 형식의 시간 문자열
 */
export const formatTimeToHourMinute = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * 날짜 문자열을 전체 날짜 형식으로 변환합니다
 * @param dateString ISO 형식의 날짜 문자열
 * @returns "2025년 9월 24일" 형식의 날짜 문자열
 */
export const formatDateFull = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
