/** 리포트 도메인 타입 (PRD §3.12). 값 출처: KiroZero.dc.html `months`. */

/** 월별 절감 집계 1건. `h`는 바차트 막대 높이(%) — 디자인 원본 수치 그대로. */
export interface ReportMonth {
  /** 월 라벨 (예: '2026년 6월') — 월 네비게이션 표기. */
  label: string;
  /** 짧은 라벨 (예: '6월') — 바차트 축 표기. */
  short: string;
  /** 음식물 절감량(kg). */
  saved: number;
  /** 재료 소진율(%). */
  rate: number;
  /** 참여 모임 수(회). */
  joined: number;
  /** 함께한 사람 수(명). */
  people: number;
  /** 제공한 재료 수(개). */
  provided: number;
  /** 사용한 재료 수(개). */
  used: number;
  /** 바차트 막대 높이(%) — 0~100. */
  h: number;
}
