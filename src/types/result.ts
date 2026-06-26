/** 사용량·리포트 도메인 DTO (백엔드 Swagger consumption-result-controller 1:1). */

/** 월별 절감 요약 (`MyResultTotalResponse.monthlyResults[]`). */
export interface MonthlyResultSummaryResponse {
  /** "yyyy-MM" (예: '2026-06'). */
  yearMonth: string;
  /** "M월" (예: '6월'). */
  monthLabel: string;
  completedSessionCount: number;
  totalUsedGrams: number;
  totalEstimatedCarbonSavedKgco2e: number;
  totalRefundAmount: number;
  togetherPeopleCount: number;
  providedIngredientCount: number;
  usedIngredientCount: number;
  averageIngredientUseRate: number;
}

/** 내 누적 리포트 (`GET /api/v1/me/results/total`). */
export interface MyResultTotalResponse {
  completedSessionCount: number;
  totalUsedGrams: number;
  totalEstimatedCarbonSavedKgco2e: number;
  totalRefundAmount: number;
  togetherPeopleCount: number;
  providedIngredientCount: number;
  usedIngredientCount: number;
  averageIngredientUseRate: number;
  currentMonthEstimatedCarbonSavedKgco2e: number;
  previousMonthEstimatedCarbonSavedKgco2e: number;
  monthOverMonthCarbonDeltaKgco2e: number;
  insightMessage: string;
  /** 월별 요약 (백엔드 내림차순 — 현재월이 앞). */
  monthlyResults: MonthlyResultSummaryResponse[];
}
