import { useState, useEffect } from 'react';
import { 
  getMyCategoryChart, 
  getMyMonthlyChart, 
  getMyKeywordChart, 
  getMyTimeChart, 
  getMyHistoryChart 
} from '../api/ChartWebview';
import { 
  CategoryChartResponse, 
  MonthlyChartResponse, 
  KeywordChartResponse, 
  TimeChartResponse, 
  HistoryChartResponse 
} from '../types/chart';

/**
 * 카테고리별 소비 패턴 차트를 가져오는 훅
 * @param userId - 사용자 ID
 * @param period - 기간 (1: 이번달, 2: 저번달, 3: 최근 6개월)
 */
export const useCategoryChart = (userId: number, period: number = 1) => {
  const [data, setData] = useState<CategoryChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMyCategoryChart(userId, period);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, period]);

  return { data, isLoading, error };
};

/**
 * 월별 소비 패턴 차트를 가져오는 훅
 * @param userId - 사용자 ID
 */
export const useMonthlyChart = (userId: number) => {
  const [data, setData] = useState<MonthlyChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMyMonthlyChart(userId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, isLoading, error };
};

/**
 * 키워드 분석 차트를 가져오는 훅
 * @param userId - 사용자 ID
 */
export const useKeywordChart = (userId: number) => {
  const [data, setData] = useState<KeywordChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMyKeywordChart(userId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, isLoading, error };
};

/**
 * 시간대별 소비 패턴 차트를 가져오는 훅
 * @param userId - 사용자 ID
 */
export const useTimeChart = (userId: number) => {
  const [data, setData] = useState<TimeChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMyTimeChart(userId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, isLoading, error };
};

/**
 * 소비 내역 차트를 가져오는 훅
 * @param userId - 사용자 ID
 */
export const useHistoryChart = (userId: number) => {
  const [data, setData] = useState<HistoryChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getMyHistoryChart(userId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, isLoading, error };
};