/**
 * 더미데이터 시드 — 월별 절감 리포트 5개월. (PRD §3.12, 값 출처: KiroZero.dc.html `months`)
 *
 * 6월(현재월)은 디자인 원본의 미조리(seed!=='COOKED') 기준 값으로 고정한다.
 *
 * TODO(API): 백엔드는 `GET /api/v1/me/results/total`로 누적 총합만 제공하며
 * 월별 추이·소진율·참여/재료 stat은 아직 미지원이다(2026-06-27 Swagger 확인).
 * 월별 리포트 엔드포인트가 생기면 `useReport()` 내부만 교체한다. 그 전까지 더미 유지.
 */
import type { ReportMonth } from '@/types';

export const reportMonths: ReportMonth[] = [
  {
    label: '2026년 2월',
    short: '2월',
    saved: 1.1,
    rate: 62,
    joined: 1,
    people: 3,
    provided: 6,
    used: 4,
    h: 24,
  },
  {
    label: '2026년 3월',
    short: '3월',
    saved: 1.8,
    rate: 70,
    joined: 2,
    people: 7,
    provided: 12,
    used: 8,
    h: 40,
  },
  {
    label: '2026년 4월',
    short: '4월',
    saved: 2.4,
    rate: 74,
    joined: 3,
    people: 11,
    provided: 18,
    used: 13,
    h: 54,
  },
  {
    label: '2026년 5월',
    short: '5월',
    saved: 3.0,
    rate: 77,
    joined: 4,
    people: 14,
    provided: 22,
    used: 17,
    h: 74,
  },
  {
    label: '2026년 6월',
    short: '6월',
    saved: 3.2,
    rate: 78,
    joined: 4,
    people: 14,
    provided: 24,
    used: 19,
    h: 84,
  },
];
