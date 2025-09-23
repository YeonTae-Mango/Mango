// 차트 관련 타입 정의

// 카테고리 차트 데이터 인터페이스
export interface CategoryChartData {
  labels: string[];
  data: number[];
  weight: number[];
  total: string;
  highest: Record<string, string>;
}

// 월별 차트 데이터 인터페이스
export interface MonthlyChartData {
  label: string[];
  data: number[];
}

// 키워드 차트 데이터 인터페이스
export interface KeywordChartData {
  labels: string[];
  data: number[];
}

// 시간대 차트 데이터 인터페이스
export interface TimeChartData {
  myData: number[];
  yourData: number[];
  timeLabels: string[];
  hotTime: string;
}

// 소비 내역 차트 데이터 인터페이스
export interface HistoryChartData {
  lastMonth: number[];
  thisMonthRaw: (number | null)[];
  todayIndex: number;
}

// API 응답 공통 구조
export interface ChartApiResponse<T> {
  message: string;
  data: T;
  status: string;
}

// 각 차트별 API 응답 타입
export type CategoryChartResponse = ChartApiResponse<CategoryChartData>;
export type MonthlyChartResponse = ChartApiResponse<MonthlyChartData>;
export type KeywordChartResponse = ChartApiResponse<KeywordChartData>;
export type TimeChartResponse = ChartApiResponse<TimeChartData>;
export type HistoryChartResponse = ChartApiResponse<HistoryChartData>;
