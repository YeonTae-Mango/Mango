// 차트별 툴팁 정보
export const chartTooltips = {
  // 시간대 차트 툴팁
  time: {
    title: "시간대별 소비 패턴",
    content: "하루 중 언제 가장 많이 소비하는지 확인할 수 있어요. 새벽, 오전, 오후, 야간으로 나누어 분석해드립니다."
  },
  
  // 카테고리 차트 툴팁
  category: {
    title: "카테고리별 소비 분석",
    content: "어떤 분야에 가장 많은 돈을 쓰는지 카테고리별로 분석해드려요. 식비, 교통비, 쇼핑 등으로 구분됩니다."
  },
  
  // 월별 차트 툴팁
  month: {
    title: "월별 소비 트렌드",
    content: "월별로 소비 패턴이 어떻게 변하는지 확인할 수 있어요. 계절적 변화나 특별한 지출을 파악해보세요."
  },
  
  // 키워드 차트 툴팁
  keyword: {
    title: "소비 키워드 분석",
    content: "당신의 소비 패턴을 나타내는 키워드들을 분석해드려요. 어떤 단어가 가장 많이 나타나는지 확인해보세요."
  },
  
  // 내역 차트 툴팁
  history: {
    title: "소비 내역 상세",
    content: "실제 소비 내역을 상세하게 확인할 수 있어요. 언제, 어디서, 얼마를 썼는지 자세히 볼 수 있습니다."
  },

  // 궁합 관련 툴팁들
  // 대표유형 궁합 툴팁
  twoType: {
    title: "대표유형 궁합 분석",
    content: "당신과 상대방의 소비 성향을 유형별로 비교해드려요. 어떤 유형끼리 잘 맞는지 확인해보세요."
  },
  
  // 카테고리 궁합 툴팁
  twoCategory: {
    title: "카테고리 궁합 분석",
    content: "어떤 분야에서 가장 많은 돈을 쓰는지 비교해드려요. 비슷한 소비 패턴을 가진 분야를 찾아보세요."
  },
  
  // 키워드 궁합 툴팁
  twoKeyword: {
    title: "키워드 궁합 분석",
    content: "소비 패턴을 나타내는 키워드를 비교해드려요. 공통 관심사나 취향을 확인할 수 있어요."
  },
  
  // 시간대 궁합 툴팁
  twoTime: {
    title: "시간대 궁합 분석",
    content: "언제 가장 많이 소비하는지 시간대별로 비교해드려요. 활동 패턴의 유사성을 확인해보세요."
  }
};

// 툴팁 스타일 정보
export const tooltipStyles = {
  button: {
    size: 32,
    backgroundColor: '#6B7280', // gray-500
    borderRadius: 16,
    position: {
      top: 8,
      left: 8  // right에서 left로 변경
    }
  },
  content: {
    backgroundColor: '#374151', // gray-700
    borderRadius: 8,
    padding: 12,
    maxWidth: 280, // 너비를 더 넓게
    minWidth: 200, // 최소 너비 설정
    position: {
      top: 44,
      left: 8  // right에서 left로 변경
    }
  },
  text: {
    title: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold' as const,
      marginBottom: 4
    },
    content: {
      color: '#FFFFFF',
      fontSize: 12,
      lineHeight: 16
    }
  }
};
