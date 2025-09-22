// 카테고리별 고정 색상 매핑
export interface CategoryColorMap {
  [category: string]: string;
}

export const CATEGORY_COLORS: CategoryColorMap = {
  // 기본 카테고리들 - Tailwind CSS 색상에 맞춰 설정
  '음식': 'rgba(59, 130, 246, 0.8)',
  '소매/유통': 'rgb(255,159,64)',
  '여가/오락': 'rgba(234, 179, 8, 0.8)',
  '미디어/통신': 'rgb(153,102,255)',
  '학문/교육': 'rgba(20, 184, 166, 0.8)',
  '공연/전시': 'rgba(107, 114, 128, 0.3)',
  '생활서비스': 'rgba(236, 72, 153, 0.8)',
};

// 기본 색상 팔레트 (매핑되지 않은 카테고리용) - Tailwind CSS 기반
export const DEFAULT_COLORS = [
  'rgba(249, 115, 22, 0.8)',   // orange-500
  'rgba(236, 72, 153, 0.8)',   // pink-500
  'rgba(234, 179, 8, 0.8)',    // yellow-500
  'rgba(20, 184, 166, 0.8)',   // teal-500
  'rgba(59, 130, 246, 0.8)',   // blue-500
  'rgba(107, 114, 128, 0.8)',  // gray-500
  'rgba(168, 85, 247, 0.8)',   // purple-500
  'rgba(34, 197, 94, 0.8)',    // green-500
  'rgba(239, 68, 68, 0.8)',    // red-500
  'rgba(99, 102, 241, 0.8)',   // indigo-500
];

/**
 * 카테고리 라벨 배열에 대응하는 색상 배열을 반환
 * @param labels 카테고리 라벨 배열
 * @returns 대응하는 색상 배열
 */
export const getCategoryColors = (labels: string[]): string[] => {
  return labels.map((label, index) => {
    // 매핑된 색상이 있으면 사용
    if (CATEGORY_COLORS[label]) {
      return CATEGORY_COLORS[label];
    }
    // 없으면 기본 색상 팔레트에서 순환 사용
    return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  });
};

/**
 * 새로운 카테고리 색상을 추가
 * @param category 카테고리 이름
 * @param color 색상 값
 */
export const addCategoryColor = (category: string, color: string): void => {
  CATEGORY_COLORS[category] = color;
};

/**
 * 호버 효과용 밝은 색상 생성
 * @param color 기본 색상
 * @returns 호버용 밝은 색상
 */
export const getHoverColor = (color: string): string => {
  // rgba의 투명도를 1.0으로 변경하여 더 진한 색상 생성
  return color.replace(/0\.8\)$/, '1.0)');
};